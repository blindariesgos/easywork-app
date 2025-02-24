"use client";
import React from "react";
import LayoutPage from "./LayoutPage";
import MeetingContextProvider from "@/src/context/meetings/provider";
import { useTranslation } from "react-i18next";
// import Cards from "./components/Cards";

export default function Page({ children, table, kanban }) {
  const { t } = useTranslation();

  return (
    <MeetingContextProvider type="group">
      <LayoutPage>
        {children}
        {table}
      </LayoutPage>
    </MeetingContextProvider>
  );
}
