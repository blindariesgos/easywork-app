"use client";
import useAppContext from "@/src/context/app";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { PencilIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useSWRConfig } from "swr";
import IconDropdown from "@/src/components/SettingsButton";
import { Cog8ToothIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useCommon } from "@/src/hooks/useCommon";
import General from "./tabs/General";
import Receipts from "./tabs/Receipts";

export default function PolicyDetails({ data, id }) {
  const { t } = useTranslation();
  const { settingsPolicy } = useCommon();
  const [loading, setLoading] = useState(false);

  const tabs = [
    t("control:portafolio:receipt:details:consult"),
    "Pagos/Recibos",
  ];

  return (
    <div className="flex flex-col h-screen relative w-full">
      {/* Formulario Principal */}
      {loading && <LoaderSpinner />}
      <div className="flex flex-col flex-1 bg-gray-200 shadow-xl text-black overflow-y-auto md:overflow-hidden rounded-tl-[35px] rounded-bl-[35px] p-4">
        <TabGroup className="flex flex-col flex-1 gap-2 text-black md:overflow-hidden rounded-t-2xl rounded-bl-2xl relative">
          {/* Encabezado del Formulario */}
          <div className="bg-transparent py-6 mx-4">
            <div className="flex justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3 xl:gap-4">
                <p className="text-xl sm:text-2xl xl:text-3xl">
                  Armando Graterol
                </p>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-xs sm:text-sm xl:text-base">
                    {t("control:portafolio:receipt:details:date")}:
                  </p>
                  <p className="text-xs sm:text-sm xl:text-base">10/06/2024</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-xs sm:text-sm xl:text-base">
                    {t("control:portafolio:receipt:details:product")}:
                  </p>
                  <p className="text-xs sm:text-sm xl:text-base">Profesional</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-xs sm:text-sm xl:text-base">
                    {t("control:portafolio:receipt:details:policy")}:
                  </p>
                  <p className="text-xs sm:text-sm xl:text-base">423659874</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-xs md:text-sm xl:text-base">
                    {t("control:portafolio:receipt:details:company")}:
                  </p>
                  <p className="text-xs md:text-sm xl:text-base">AXXA</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-xs md:text-sm xl:text-base">
                    {t("control:portafolio:receipt:details:client-code")}:
                  </p>
                  <p className="text-xs md:text-sm xl:text-base">326598</p>
                </div>
              </div>
              <IconDropdown
                icon={
                  <Cog8ToothIcon
                    className="h-8 w-8 text-primary"
                    aria-hidden="true"
                  />
                }
                options={settingsPolicy}
                width="w-[140px]"
              />
            </div>
          </div>
          <TabList className="flex items-center gap-6  bg-gray-100 rounded-2xl py-2 px-4 w-full">
            {tabs.map((tab) => (
              <Tab
                key={tab}
                className="data-[selected]:bg-blue-100 data-[hover]:bg-blue-400 outline-none focus:outline-none data-[selected]:text-white data-[hover]:text-white rounded-md px-2 py-3"
              >
                {tab}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            <TabPanel>
              <General data={data} id={id} />
            </TabPanel>
            <TabPanel>
              <Receipts data={data} id={id} />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
