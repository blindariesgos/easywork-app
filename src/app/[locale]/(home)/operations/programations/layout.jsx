import React, { Suspense } from "react";
import LayoutPage from "./LayoutPage";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import ProgramationsContextProvider from "@/src/context/programations/provider";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import TabPages from "@/src/components/TabPages";

export default async function Layout({ children, table, kanban }) {
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
    <div className="bg-gray-100 h-full p-2 rounded-xl relative">
      <ProgramationsContextProvider>
        <LayoutPage>
          <Suspense fallback={<LoaderSpinner />}>
            <TabPages tabs={tabs} />
            {children}
          </Suspense>
        </LayoutPage>
      </ProgramationsContextProvider>
    </div>
  );
}
