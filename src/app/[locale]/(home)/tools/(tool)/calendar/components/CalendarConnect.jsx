"use client";
import Image from "next/image";
import SliderOverShort from "../../../../../../../components/SliderOverShort";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import useAppContext from "../../../../../../../context/app/index";
import { useRouter, useSearchParams } from "next/navigation";
import { saveFolders } from "../../../../../../../lib/apis";
import { getTokenGoogle } from "../../../../../../../lib/apis";
import Tag from "../../../../../../../components/Tag";
import {
  EllipsisHorizontalIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/20/solid";

export default function CalendarConnect() {
  const router = useRouter();
  const session = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { replace } = useRouter();

  const openDisconnect = () => {
    params.set("disconnect", true);
    replace(`/tools/calendar?${params.toString()}`);
  };


  const closeConfig = () => {
    params.delete("connect");
    const newSearch = params.toString();
    router.push(`?${newSearch}`, undefined, { shallow: true });
  };

  return (
    <SliderOverShort openModal={params.get("connect")}>
      <Tag onclick={() => closeConfig()} className="bg-green-500" />
      <div className="bg-gray-300 max-md:w-screen w-96 rounded-l-2xl overflow-y-auto h-screen">
        <div className="m-3 text-lg flex items-center">
          <CalendarDaysIcon className="h-14 w-14 text-easywork-main" />
          <div className="ml-3 pr-2">
            <h1 className="text-xl">Conectar calendarios</h1>
            <p className="text-xs">
              Haga un seguimiento de sus eventos y reuniones en el calendario de
              EasyWork
            </p>
          </div>
        </div>
        <div className="m-3 py-5 bg-gray-100 rounded-2xl">
          <div className="bg-white p-2 m-3 flex justify-between">
            <div className="flex">
              <div className="rounded-full p-3 bg-slate-100">
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
                  <p className="text-xs">Hace 6 minutos atrás</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
              <p className="text-xs ml-2">Contectado</p>
              <Cog6ToothIcon className="ml-2 h-4 w-4 text-gray-50 cursor-pointer" onClick={() => {openDisconnect()}} />
            </div>
          </div>
          <div className="bg-white p-2 m-3 flex justify-between">
            <div className="flex">
              <div className="rounded-full p-3 bg-slate-100">
                <Image
                  className="h-7 w-7"
                  width={36}
                  height={36}
                  src={"/icons/office365CalendarIcon.svg"}
                  alt=""
                />
              </div>
              <div>
                <div className="mb-3 p-1">
                  <h1 className="text-sm">Calendario de Office365</h1>
                  <p className="text-xs"></p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <button
                type="button"
                className="rounded-md bg-primary px-3 mr-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Conectar
              </button>
            </div>
          </div>
          <div className="bg-white p-2 m-3 flex justify-between">
            <div className="flex">
              <div className="rounded-full p-3 bg-slate-100">
                <Image
                  className="h-7 w-7"
                  width={36}
                  height={36}
                  src={"/icons/icloudCalendarIcon.svg"}
                  alt=""
                />
              </div>
              <div>
                <div className="mb-3 p-1">
                  <h1 className="text-sm">Calendario de iCloud</h1>
                  <p className="text-xs"></p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <button
                type="button"
                className="rounded-md bg-primary px-3 mr-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Conectar
              </button>
            </div>
          </div>
          <div className="bg-white p-2 m-3">
            <div className="text-sm">
              <div className="flex ml-2 mt-2 justify-between">
                <div className="flex">
                  <input type="checkbox" />
                  <p className="ml-1 text-xs text-gray-50">
                    Optimice su trabajo conectando sus calendarios a EasyWork.
                    Administre la participación de su equipo desde cualquier
                    dispositivo.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-start">
              <p className="text-xs underline text-gray-50 ml-2">
                Conectar otros calendarios
              </p>
            </div>
          </div>
        </div>
      </div>
    </SliderOverShort>
  );
}
