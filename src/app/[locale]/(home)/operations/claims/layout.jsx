import React, { Suspense } from "react";
import LayoutPage from "./LayoutPage";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import ClaimsContextProvider from "@/src/context/claims/provider";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import TabPages from "@/src/components/TabPages";

export default async function Layout({ children, table, kanban }) {
  const tabs = [
    {
      name: "Kanban",
      // component: kanban,
      disabled: true,
    },
    {
      name: "Lista",
      component: table,
    },
  ];
  return (
    <ClaimsContextProvider>
      <LayoutPage>
        <Suspense fallback={<LoaderSpinner />}>
          <TabPages tabs={tabs} />
          {children}
        </Suspense>
      </LayoutPage>
    </ClaimsContextProvider>
  );
}
