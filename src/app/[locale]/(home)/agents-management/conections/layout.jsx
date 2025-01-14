import React, { Suspense } from "react";
import LayoutPage from "./LayoutPage";
import ConnectionsContextProvider from "@/src/context/connections/provider";

export default async function Layout({ children, table, kanban }) {
  return (
    <div className="bg-gray-100 h-full p-2 rounded-xl relative">
      <ConnectionsContextProvider>
        <LayoutPage table={table} kanban={kanban}>
          {children}
        </LayoutPage>
      </ConnectionsContextProvider>
    </div>
  );
}
