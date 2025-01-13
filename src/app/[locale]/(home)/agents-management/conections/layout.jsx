import React, { Suspense } from "react";
import LayoutPage from "./LayoutPage";
import ConnectionsContextProvider from "@/src/context/connections/provider";

export default async function Layout({ children, table, kanban }) {
  return (
    <div className="bg-gray-100 h-full p-2 rounded-xl relative">
      <ConnectionsContextProvider
        customFilters={[
          {
            id: 8,
            name: "Proceso cerrado",
            type: "select",
            check: true,
            code: "isClosed",
            options: [
              {
                name: "Si",
                id: "true",
              },
              {
                name: "No",
                id: "false",
              },
            ],
          },
        ]}
      >
        <LayoutPage table={table} kanban={kanban}>
          {children}
        </LayoutPage>
      </ConnectionsContextProvider>
    </div>
  );
}
