"use client";
import Header from "../../../../../../components/header/Header";
import { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LeadsHeader from "./components/LeadsHeader";
import LoaderSpinner from "../../../../../../components/LoaderSpinner";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

export default function LayoutLeads({ table, children, kanban }) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const tabs = [
    {
      name: "Kanban",
      component: kanban,
      // disabled: true,
    },
    {
      name: "Lista",
      component: table,
    },
  ];

  return (
    <div className="bg-gray-100 h-full p-4 rounded-xl relative flex flex-col w-full gap-4">
      <Header />
      <LeadsHeader />
      <Suspense fallback={<LoaderSpinner />}>
        <TabGroup
          defaultIndex={1}
          className="w-full flex flex-col items-start gap-4"
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
        </TabGroup>
      </Suspense>
      {children}
    </div>
  );
}
