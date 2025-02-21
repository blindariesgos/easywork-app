"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx from "clsx";
import { Profile, Tasks, Calendar, Drive } from "./components";

const UserDetails = ({ user }) => {
  const { t } = useTranslation();

  const tabs = [
    { name: t("contacts:create:tabs:general"), value: 0 },
    { name: "Tareas", value: 1 },
    { name: "Calendario", value: 2 },
    { name: "Drive", value: 3 },
    { name: "Actividades", value: 4 },
  ];

  return (
    <div className="flex flex-col flex-1 bg-gray-600 shadow-xl text-black overflow-y-auto md:overflow-hidden rounded-tl-[35px] rounded-bl-[35px] p-4">
      <TabGroup className="flex flex-col flex-1 text-black md:overflow-hidden rounded-t-2xl rounded-bl-2xl">
        {/* Encabezado del Formulario */}
        <div className="bg-transparent p-4">
          <div className="flex items-start flex-col justify-between gap-4">
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
              <TabPanel className="w-full">
                <Profile data={user} />
              </TabPanel>
              <TabPanel className="w-full">
                <Tasks id={user.id} />
              </TabPanel>
              <TabPanel className="w-full">
                <Calendar />
              </TabPanel>
              <TabPanel className="w-full">
                <Drive />
              </TabPanel>
            </TabPanels>
          </div>
        </div>
      </TabGroup>
    </div>
  );
};

export default UserDetails;
