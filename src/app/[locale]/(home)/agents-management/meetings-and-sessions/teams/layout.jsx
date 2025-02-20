"use client";
import React, { Suspense } from "react";
import LayoutPage from "./LayoutPage";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import MeetingContextProvider from "@/src/context/meetings/provider";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useTranslation } from "react-i18next";
// import Cards from "./components/Cards";

export default function Page({ children, table, kanban }) {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-100 h-full p-2 rounded-xl relative">
      <MeetingContextProvider type="group">
        <LayoutPage>
          {/* <Suspense fallback={<LoaderSpinner />}> */}
          {/* <TabGroup
              defaultIndex={1}
              className="w-full flex flex-col items-start"
            >
              <TabList className="bg-zinc-300/40 rounded-full flex gap-1 items-center p-1 ">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    className="data-[selected]:bg-white py-2 px-3 rounded-full text-xs outline-none focus:outline-none hover:outline-none"
                    disabled={tab.disabled}
                  >
                    {tab.name}
                  </Tab>
                ))}
              </TabList>
              <TabPanels className="w-full">
                {tabs.map((tab) => (
                  <TabPanel key={tab.name} className="w-full">
                    {tab.component}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup> */}
          {children}
          {/* </Suspense> */}
          {table}
        </LayoutPage>
      </MeetingContextProvider>
    </div>
  );
}
