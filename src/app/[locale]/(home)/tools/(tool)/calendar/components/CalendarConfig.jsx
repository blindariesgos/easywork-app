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
} from "@heroicons/react/20/solid";

export default function CalendarConfig() {
  const router = useRouter();
  const session = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const closeConfig = () => {
    params.delete("config");
    const newSearch = params.toString();
    router.push(`?${newSearch}`, undefined, { shallow: true });
  };

  return (
    <SliderOverShort openModal={params.get("config")}>
      <Tag onclick={() => closeConfig()} className="bg-green-500" />
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
