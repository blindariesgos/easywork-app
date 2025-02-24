"use client";
import React, { Suspense } from "react";
import AccompanimentsHeader from "./components/Header";
import TabPages from "@/src/components/TabPages";
import LoaderSpinner from "@/src/components/LoaderSpinner";

export default function LayoutPage({ table, children, kanban }) {
  const tabs = [
    {
      name: "Kanban",
      component: kanban,
      // disabled: true,
    },
    {
      name: "Lista",
      component: table,
    },
  ];

  return (
    <div className="h-full relative flex flex-col gap-2">
      <AccompanimentsHeader />
      <Suspense fallback={<LoaderSpinner />}>
        <TabPages tabs={tabs} />
      </Suspense>
      {children}
    </div>
  );
}
