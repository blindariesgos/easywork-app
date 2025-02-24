import React, { Suspense } from "react";
import LayoutPage from "./LayoutPage";
import ConnectionsContextProvider from "@/src/context/connections/provider";

export default async function Layout({ children, table, kanban }) {
  return (
    <ConnectionsContextProvider>
      <LayoutPage table={table} kanban={kanban}>
        {children}
      </LayoutPage>
    </ConnectionsContextProvider>
  );
}
