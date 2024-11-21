"use client";
import LeadsContextProvider from "../../../../../../context/leads/provider";
import LayoutLeads from "./LayoutLead";

export default function Layout({ children, table, kanban }) {
  return (
    <LeadsContextProvider>
      <LayoutLeads table={table} kanban={kanban}>
        {children}
      </LayoutLeads>
    </LeadsContextProvider>
  );
}
