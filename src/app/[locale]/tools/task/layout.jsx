"use client";
import ToolHeader from "@/components/ToolHeader";
import React from "react";
import CreateTaskButton from "./components/CreateTaskButton";
import { Cog8ToothIcon, TrashIcon } from "@heroicons/react/20/solid";
import TaskSubMenu from "./components/TaskSubMenu";
import { useTranslation } from "react-i18next";

export default function TaskLayout({ children, table }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col flex-grow">
      <ToolHeader
        title="Tareas"
        ActionButton={CreateTaskButton}
        ToolsButtons={
          <>
            <button
              type="button"
              className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <TrashIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <Cog8ToothIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            </button>
          </>
        }
      >
        <div className="flex-none items-center justify-between  border-gray-200 py-4 hidden lg:flex">
          <TaskSubMenu />
        </div>
      </ToolHeader>

      {table}
      {children}
    </div>
  );
}
