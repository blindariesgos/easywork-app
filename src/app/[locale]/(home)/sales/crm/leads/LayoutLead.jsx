"use client";
import { Suspense } from "react";
import LeadsHeader from "./components/LeadsHeader";
import LoaderSpinner from "../../../../../../components/LoaderSpinner";
import TabPages from "@/src/components/TabPages";
import LeadsSubMenu from "./components/LeadsSubMenu";

export default function LayoutLeads({ table, children, kanban }) {
  const tabs = [
    {
      name: "Kanban",
      component: kanban,
    },
    {
      name: "Lista",
      component: table,
    },
  ];

  return (
    <div className="h-full relative flex flex-col gap-2">
      <LeadsHeader />
      <Suspense fallback={<LoaderSpinner />}>
        <TabPages tabs={tabs}>
          <div className="flex-none items-center justify-between  border-gray-200 hidden lg:flex">
            <LeadsSubMenu />
          </div>
        </TabPages>
      </Suspense>
      {children}
    </div>
  );
}
