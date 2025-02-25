import React from "react";
import LayoutPage from "./LayoutPage";
import RecruitmentsContextProvider from "@/src/context/recruitments/provider";

export default async function Layout({ children, table, kanban }) {
  return (
    <RecruitmentsContextProvider>
      <LayoutPage table={table} kanban={kanban}>
        {children}
      </LayoutPage>
    </RecruitmentsContextProvider>
  );
}
