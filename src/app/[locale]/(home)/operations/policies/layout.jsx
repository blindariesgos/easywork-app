import React, { Suspense } from "react";
import LayoutPolicies from "./LayoutPolicies";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import PoliciesContextProvider from "../../../../../context/policies/provider";

export default async function PolicyLayout({ children, table }) {
  console.log("paso por el lagout de polizas");
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
