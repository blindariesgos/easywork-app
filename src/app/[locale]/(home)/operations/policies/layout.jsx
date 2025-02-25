import React, { Suspense } from "react";
import LayoutPolicies from "./LayoutPolicies";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import PoliciesContextProvider from "../../../../../context/policies/provider";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import TabPages from "@/src/components/TabPages";

export default async function PolicyLayout({ children, table, kanban }) {
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
    <PoliciesContextProvider>
      <LayoutPolicies>
        <Suspense fallback={<LoaderSpinner />}>
          <TabPages tabs={tabs} />
          {children}
        </Suspense>
      </LayoutPolicies>
    </PoliciesContextProvider>
  );
}
