import React, { Suspense } from "react";
import LayoutPage from "./LayoutPage";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import AccompanimentsContextProvider from "@/src/context/accompaniments/provider";

export default async function Layout({ children, table, kanban }) {
  return (
    <AccompanimentsContextProvider>
      <LayoutPage>
        <Suspense fallback={<LoaderSpinner />}>
          {table}
          {children}
        </Suspense>
      </LayoutPage>
    </AccompanimentsContextProvider>
  );
}
