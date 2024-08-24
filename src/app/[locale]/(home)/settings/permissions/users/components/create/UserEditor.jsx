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
      <div className="flex flex-col flex-1 bg-gray-600 shadow-xl text-black overflow-y-auto md:overflow-hidden rounded-tl-[35px] rounded-bl-[35px] p-4">
        <TabGroup className="flex flex-col flex-1 text-black md:overflow-hidden rounded-t-2xl rounded-bl-2xl relative">
          {/* Encabezado del Formulario */}
          <div className="bg-transparent p-4">
            <div className="flex items-start flex-col justify-between gap-4 relative">
              {!id && (
                <div className="inset-0 bg-white/75 w-full h-full z-50 absolute rounded-t-2xl" />
              )}
              <div className="flex gap-2 items-center">
                <h1 className="text-xl sm:pl-6 pl-2">
                  {user
                    ? `${user?.profile.firstName} ${user?.profile?.lastName}` ??
                      user.name
                    : t("leads:create:client")}
                </h1>
              </div>
              <TabList className="flex gap-x-8 flex-wrap justify-start bg-white py-2 px-4 w-full rounded-lg">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.value}
                    className={clsx(
                      "data-[selected]:border-indigo-500 data-[selected]:text-white data-[selected]:bg-blue-100 data-[selected]:rounded-md data-[selected]:focus:outline-none data-[selected]:focus:ring-0",
                      "whitespace-nowrap p-2 text-sm font-medium cursor-pointer focus:outline-none focus:ring-0"
                    )}
                  >
                    {tab.name}
                  </Tab>
                ))}
              </TabList>
              <TabPanels className="w-full overflow-auto">
                <TabPanel className="w-full ">
                  <General user={user} id={id} />
                </TabPanel>
                <TabPanel className="w-full ">
                  <Tasks user={user} id={id} />
                </TabPanel>
              </TabPanels>
            </div>
          </div>
        </TabGroup>
      </div>
    </div>
  );
}
