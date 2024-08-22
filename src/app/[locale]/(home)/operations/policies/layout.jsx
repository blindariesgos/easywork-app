import React, { Suspense } from "react";
import LayoutPolicies from "./LayoutPolicies";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import PoliciesContextProvider from "../../../../../context/policies/provider";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

export default async function ReceiptLayout({ children, table }) {
  return (
    <div className="bg-gray-100 h-full p-2 rounded-xl relative">
      <PoliciesContextProvider>
        <LayoutPolicies>
          <Suspense fallback={<LoaderSpinner />}>
            {table}
            {children}
          </Suspense>
        </LayoutPolicies>
      </PoliciesContextProvider>
    </div>
  );
}
