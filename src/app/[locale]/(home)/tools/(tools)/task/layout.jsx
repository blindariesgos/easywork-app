"use client";
import ToolHeader from "@/components/ToolHeader";
import React from "react";
import { Cog8ToothIcon, TrashIcon } from "@heroicons/react/20/solid";
import TaskSubMenu from "./components/TaskSubMenu";
import { useTranslation } from "react-i18next";
import { useTasks } from "@/hooks/useCommon";
import IconDropdown from "@/components/SettingsButton";
import FiltersTasks from "./components/filters/FiltersTasks";

export default function TaskLayout({ children, table }) {
  const { t } = useTranslation();
  const { optionsSettings, optionsTrash } = useTasks();
  return (
    <div className="flex flex-col flex-grow">
      <ToolHeader
        title={t('tools:tasks:name')}
        route="/tools/task"
        Filters={FiltersTasks}
        toolButtons={(
          <>
            <IconDropdown
              icon={<TrashIcon className="h-8 w-8 text-primary" aria-hidden="true" />}
              options={optionsTrash}
              width="w-72"
            />
            <IconDropdown
              icon={<Cog8ToothIcon className="h-8 w-8 text-primary" aria-hidden="true" />}
              options={optionsSettings}
              width="w-[340px]"
              colorIcon="text-green-100"
              excel={t('leads:header:excel:export')}
            />
          </>
        )}
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
