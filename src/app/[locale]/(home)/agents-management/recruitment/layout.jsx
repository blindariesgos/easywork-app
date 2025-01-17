import React, { Suspense } from "react";
import LayoutPage from "./LayoutPage";
import RecruitmentsContextProvider from "@/src/context/recruitments/provider";

export default async function Layout({ children, table, kanban }) {
  return (
    <div className="bg-gray-100 h-full p-2 rounded-xl relative">
      <RecruitmentsContextProvider>
        <LayoutPage table={table} kanban={kanban}>
          {children}
        </LayoutPage>
      </RecruitmentsContextProvider>
    </div>
  );
}
