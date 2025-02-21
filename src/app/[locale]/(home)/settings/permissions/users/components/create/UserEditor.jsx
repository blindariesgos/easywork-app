"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx from "clsx";
import General from "../tabs/General";
import Tasks from "../tabs/Tasks";

export default function UserEditor({ user, id }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const tabs = [
    { name: t("contacts:create:tabs:general"), value: 0 },
    { name: "Tareas", value: 1 },
    // { name: "Calendario", value: 2 },
    // { name: "Acompañamiento", value: 3 },
    // { name: "Flujo de comunicación", value: 4 },
    // { name: "mas", value: 5 },
  ];

  return (
    <div className="flex flex-col h-screen relative w-full">
      {/* Formulario Principal */}
      {loading && <LoaderSpinner />}
      <div className="flex flex-col flex-1 bg-gray-600 shadow-xl text-black overflow-y-auto md:overflow-hidden rounded-tl-[35px] rounded-bl-[35px]">
        <TabGroup className="flex flex-col flex-1 text-black md:overflow-hidden rounded-t-2xl rounded-bl-2xl">
          {/* Encabezado del Formulario */}
          <div className="pt-6 pb-4 px-4 lg:px-8">
            <h1 className="text-xl sm:pl-6 pl-2 font-semibold pb-6">
              {user
                ? (`${user?.profile?.firstName} ${user?.profile?.lastName}` ??
                  user.name)
                : t("leads:create:client")}
            </h1>
            <TabList className="flex gap-x-8 flex-wrap justify-start bg-white py-2 px-4 w-full rounded-lg">
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  className={clsx(
                    " data-[selected]:text-white data-[selected]:bg-blue-100 data-[selected]:rounded-md data-[selected]:focus:outline-none data-[selected]:focus:ring-0",
                    "whitespace-nowrap py-2 px-3 text-sm text-gray-300 font-medium cursor-pointer focus:outline-none focus:ring-0"
                  )}
                >
                  {tab.name}
                </Tab>
              ))}
            </TabList>
          </div>
          <div className="pb-6 px-4 lg:px-8">
            <TabPanels className="w-full overflow-auto ">
              <TabPanel className="w-full ">
                <General user={user} id={id} />
              </TabPanel>
              <TabPanel className="w-full ">
                <Tasks user={user} id={id} />
              </TabPanel>
            </TabPanels>
          </div>
        </TabGroup>
      </div>
    </div>
  );
}
