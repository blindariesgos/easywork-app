"use client";
import useAppContext from "@/src/context/app";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import Tag from "@/src/components/Tag";
import { Profile, Tasks, Calendar, Drive } from "./components";

export default function Info({ status, statusList }) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();

  // Calculate the user 18th birthday
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  const tabs = [
    { name: t("contacts:create:tabs:general"), value: 0 },
    { name: "Tareas", value: 1 },
    { name: "Calendario", value: 2 },
    { name: "Drive", value: 3 },
    { name: "Actividades", value: 4 },
    // { name: "Flujo de comunicación", value: 4 },
    // { name: "mas", value: 5 },
  ];

  return (
    <Transition
      show={params.get("infoP") === "true"}
      as={Fragment}
      afterLeave={() => {
        router.back();
      }}
    >
      <Dialog as="div" className="relative z-[10000]" onClose={() => {}}>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-6 2xl:pl-52">
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className={`pointer-events-auto w-screen drop-shadow-lg`}>
                  <div className="flex justify-end h-screen">
                    <div className={`flex flex-col`}>
                      <Tag
                        title={"Perfil"}
                        onclick={() => router.back()}
                        className="bg-easywork-main"
                      />
                    </div>
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
                                <Profile
                                  status={status}
                                  statusList={statusList}
                                />
                              </TabPanel>
                              <TabPanel className="w-full">
                                <Tasks />
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
                  </div>
                </div>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
