"use client";
import LeadsContextProvider from "../../../../../../context/leads/provider";
import LayoutLeads from "./LayoutLead";

export default function Layout({ children, table }) {
  return (
    <LeadsContextProvider>
      <LayoutLeads table={table}>{children}</LayoutLeads>
    </LeadsContextProvider>
  );
}
