"use client";
import SliderOverShort from "../../../../../../../components/SliderOverShort";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteTokenGoogle } from "../../../../../../../lib/apis";
import Tag from "../../../../../../../components/Tag";
import Image from "next/image";
import { toast } from "react-toastify";
import axios from "axios";

export default function CalendarDisconnect({ selectOauth, setSelectOauth }) {
  const router = useRouter();
  const session = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [listCalendars, setListCalendars] = useState([]);

  useEffect(() => {
    if (params.get("disconnect") === "true") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/calendar/list/${session?.data?.user?.id}/${selectOauth?.id}`
        )
        .then((res) => {
          setListCalendars(res.data);
        });
    }
  }, [params.get("disconnect")]);

  const closeConfig = () => {
    params.delete("disconnect");
    const newSearch = params.toString();
    router.push(`?${newSearch}`, undefined, { shallow: true });
  };

  async function deleteOauth() {
    try {
      await deleteTokenGoogle(session?.data?.user?.id, selectOauth?.id, null, true);
      setSelectOauth(null);
      router.push("/tools/calendar");
      toast.success("Calendario de Google desconectado");
    } catch (error) {
      toast.error(error);
    }
  }

  return (
    <SliderOverShort openModal={params.get("disconnect")}>
      <Tag onclick={() => closeConfig()} className="bg-easywork-main" />
      <div className="bg-gray-300 max-md:w-screen w-96 rounded-l-2xl overflow-y-auto h-screen">
        <div className="m-3 font-medium text-lg flex justify-between">
          <h1>Calendario de Google</h1>
        </div>
        <div className="m-3 py-5 bg-gray-100 rounded-2xl">
          <div className="bg-white p-2 m-3">
            <div className="bg-white m-3 flex justify-between">
              <div className="flex items-center">
                <div className="rounded-full p-3 flex items-center bg-slate-100">
                  <Image
                    className="h-7 w-7"
                    width={36}
                    height={36}
                    src={"/icons/googleCalendarIcon.svg"}
                    alt=""
                  />
                </div>
                <div>
                  <div className="mb-3 p-1">
                    <h1 className="text-sm">Calendario de Google</h1>
                    <p className="text-xs"></p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="rounded-md bg-gray-50 px-3 mr-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => deleteOauth()}
                >
                  Desconectar
                </button>
              </div>
            </div>
            <p className="text-xs mb-3 pt-2 border-t-2">
              Lo calendarios seleccionados se sincronizarán con el calendario de
              EasyWork. Los eventos de los calendarios de origen afectarán sus
              horarios. Los intervalos de tiempo asignados se mostrarán como no
              disponibles para los otros empleados.
            </p>
            <div className="text-sm">
              {listCalendars.map((item, index) => (
                <div className="flex ml-2 justify-between mb-2" key={index}>
                  <div className="flex">
                    <input type="checkbox" />
                    <p className="ml-1 text-xs">{item?.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SliderOverShort>
  );
}
