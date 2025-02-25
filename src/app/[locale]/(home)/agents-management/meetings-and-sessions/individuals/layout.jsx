"use client";
import React from "react";
import LayoutPage from "./LayoutPage";
import MeetingContextProvider from "@/src/context/meetings/provider";

export default function Page({ children, table, kanban }) {
  return (
    <MeetingContextProvider type="individual">
      <LayoutPage>
        {children}
        {/* </Suspense> */}
        {table}
      </LayoutPage>
    </MeetingContextProvider>
  );
}
