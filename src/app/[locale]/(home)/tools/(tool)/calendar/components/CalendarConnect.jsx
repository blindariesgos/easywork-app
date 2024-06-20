"use client";
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
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  CalendarDaysIcon,
} from "@heroicons/react/20/solid";

export default function CalendarConnect() {
  const router = useRouter();
  const session = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

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
              <div className="flex ml-2 mt-2 justify-between">
                <div className="flex">
                  <input type="checkbox" />
                  <p className="ml-1">Soporte Principal</p>
                </div>
                <EllipsisHorizontalIcon className="h-5 w-6 text-gray-50" />
              </div>
            </div>
          </div>
          <div className="bg-white p-2 m-3">
            <div className="mb-3 p-1">
              <h1 className="font-medium">
                Google blindablindariesgos@gmail.com
              </h1>
            </div>
            <div className="text-sm">
              <div className="flex ml-2 mt-2 justify-between">
                <div className="flex">
                  <input type="checkbox" />
                  <p className="ml-1">Bitrix24 Eventos Generales</p>
                </div>
                <EllipsisHorizontalIcon className="h-5 w-6 text-gray-50" />
              </div>
              <div className="flex ml-2 mt-2 justify-between">
                <div className="flex">
                  <input type="checkbox" />
                  <p className="ml-1">Bitrix24 PERSONAL</p>
                </div>
                <EllipsisHorizontalIcon className="h-5 w-6 text-gray-50" />
              </div>
              <div className="flex ml-2 mt-2 justify-between">
                <div className="flex">
                  <input type="checkbox" />
                  <p className="ml-1">Bitrix24 Soporte Principal</p>
                </div>
                <EllipsisHorizontalIcon className="h-5 w-6 text-gray-50" />
              </div>
              <div className="flex ml-2 mt-2 justify-between">
                <div className="flex">
                  <input type="checkbox" />
                  <p className="ml-1">blindablindariesgos@gmail.com</p>
                </div>
                <EllipsisHorizontalIcon className="h-5 w-6 text-gray-50" />
              </div>
            </div>
          </div>
          <div className="bg-white p-2 m-3">
            <div className="mb-3 p-1">
              <h1 className="font-medium">Calendarios de Google</h1>
            </div>
            <div className="text-sm">
              <div className="flex ml-2 mt-2 justify-between">
                <div className="flex">
                  <input type="checkbox" />
                  <p className="ml-1">blindablindariesgos@gmail.com</p>
                </div>
                <EllipsisHorizontalIcon className="h-5 w-6 text-gray-50" />
              </div>
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
