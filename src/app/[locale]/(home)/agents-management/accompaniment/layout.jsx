import React, { Suspense } from "react";
import LayoutPage from "./LayoutPage";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import AccompanimentsContextProvider from "@/src/context/accompaniments/provider";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

export default async function Layout({ children, table, kanban }) {
  return (
    <div className="bg-gray-100 h-full p-2 rounded-xl relative">
      <AccompanimentsContextProvider>
        <LayoutPage>
          <Suspense fallback={<LoaderSpinner />}>
            {table}
            {children}
          </Suspense>
        </LayoutPage>
      </AccompanimentsContextProvider>
    </div>
  );
}
