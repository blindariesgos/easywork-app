import React, { Suspense } from "react";
import LayoutPage from "./LayoutPage";
import AccompanimentsContextProvider from "@/src/context/accompaniments/provider";

export default async function Layout({ children, table, kanban }) {
  return (
    <div className="bg-gray-100 h-full p-2 rounded-xl relative">
      <AccompanimentsContextProvider
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
      </AccompanimentsContextProvider>
    </div>
  );
}
