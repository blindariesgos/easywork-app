import React, { Suspense } from "react";
import LayoutPage from "./LayoutPage";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import RefundsContextProvider from "@/src/context/refunds/provider";
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
    <RefundsContextProvider>
      <LayoutPage>
        <Suspense fallback={<LoaderSpinner />}>
          <TabPages tabs={tabs} />
        </Suspense>
        {children}
      </LayoutPage>
    </RefundsContextProvider>
  );
}
