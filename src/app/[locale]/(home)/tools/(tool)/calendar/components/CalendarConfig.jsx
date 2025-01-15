"use client";
import SliderOverShort from "../../../../../../../components/SliderOverShort";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Tag from "../../../../../../../components/Tag";
import {
  ChevronDownIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import { toast } from "react-toastify";

export default function CalendarConfig({ selectOauth }) {
  const router = useRouter();
  const session = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [listCalendars, setListCalendars] = useState([]);

  useEffect(() => {
    if (params.get("config") === "true") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/calendar/list/${session?.data?.user?.sub}/${selectOauth?.id}`
        )
        .then((res) => {
          setListCalendars(res.data);
        })
        .catch((err) => {
          console.log(err);
          toast.error(
            "El token de actualización no es válido o ha expirado. Vuelva a autenticarse."
          );
        });
    }
  }, [params.get("config")]);

  const closeConfig = () => {
    params.delete("config");
    const newSearch = params.toString();
    router.push(`?${newSearch}`, undefined, { shallow: true });
  };

  return (
    <SliderOverShort openModal={params.get("config")}>
      <Tag onclick={() => closeConfig()} className="bg-easywork-main" />
      <div className="bg-gray-300 max-md:w-screen w-96 rounded-l-2xl overflow-y-auto h-screen">
        <div className="m-3 font-medium text-lg flex justify-between">
          <h1>Calendarios</h1>
          <div>
            <button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-indigo-500">
              Agregar
              <ChevronDownIcon
                className="-mr-1 h-5 w-5 text-slate-100"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
        <div className="m-3 py-5 bg-gray-100 rounded-2xl">
          <div className="bg-white p-2 m-3">
            <div className="mb-3 p-1">
              <h1 className="font-medium">Mis Calendarios</h1>
            </div>
            <div className="text-sm">
              <div className="flex ml-2 justify-between">
                <div className="flex">
                  <input type="checkbox" />
                  <p className="ml-1">PERSONAL</p>
                </div>
                <EllipsisHorizontalIcon className="h-5 w-6 text-gray-50" />
              </div>
            </div>
          </div>
          <div className="bg-white p-2 m-3">
            <div className="mb-3 p-1">
              <h1 className="font-medium">Google {selectOauth?.email}</h1>
            </div>
            <div className="text-sm">
              {listCalendars &&
                listCalendars?.map((item, index) => (
                  <div className="flex ml-2 mt-2 justify-between" key={index}>
                    <div className="flex">
                      <input type="checkbox" />
                      <p className="ml-1">{item?.summary}</p>
                    </div>
                    <EllipsisHorizontalIcon className="h-5 w-6 text-gray-50" />
                  </div>
                ))}
            </div>
            <div className="mt-6 flex justify-center">
              <p className="text-xs underline text-gray-50">
                Configurar los ajustes de sincronización
              </p>
            </div>
          </div>
        </div>
      </div>
    </SliderOverShort>
  );
}
