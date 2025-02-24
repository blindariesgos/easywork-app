"use client";
import ToolHeader from "@/src/components/ToolHeader";
import React, { Fragment, Suspense } from "react";
import { Cog8ToothIcon, TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import TaskSubMenu from "./components/TaskSubMenu";
import { useTranslation } from "react-i18next";
import IconDropdown from "@/src/components/SettingsButton";
import FiltersTasks from "./components/filters/FiltersTasks";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useTasksConfigs } from "@/src/hooks/useCommon";
import useToolsContext from "../../../../../../context/tools";
import { useSWRConfig } from "swr";
import { deleteTask } from "@/src/lib/apis";
import { handleApiError } from "@/src/utils/api/errors";
import { toast } from "react-toastify";
import { deleteTask as apiDeleteTask } from "@/src/lib/apis"; // Ajusta el path según sea necesario
import { useAlertContext } from "@/src/context/common/AlertContext";
import TasksContextProvider from "@/src/context/tasks/provider";
import TabPages from "@/src/components/TabPages";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

export default function TaskLayout({ children, table, kanban }) {
  const [loading, setLoading] = React.useState(false);
  const { onCloseAlertDialog } = useAlertContext();
  const { selectedTasks, setSelectedTasks } = useToolsContext();
  const { t } = useTranslation();
  const { optionsSettings } = useTasksConfigs();
  const { mutate } = useSWRConfig();

  const deleteTasks = async () => {
    try {
      setLoading(true);
      if (selectedTasks.length === 1) await apiDeleteTask(selectedTasks[0].id);
      else if (selectedTasks.length > 1) {
        await Promise.all(selectedTasks.map((task) => apiDeleteTask(task.id)));
      }
      toast.success(t("tools:tasks:delete-msg"));
      setSelectedTasks([]);
      await mutate(`/tools/tasks/user?limit=15&page=1`);
    } catch (error) {
      console.log(error);
      handleApiError("Error al eliminar la(s) tarea(s)");
    } finally {
      setLoading(false);
      onCloseAlertDialog();
    }
  };

  const optionsTrash = [
    {
      value: 0,
      name: t("tools:tasks:header:delete:remove"),
      icon: XMarkIcon,
      onClick: () => deleteTasks(),
    },
    {
      value: 1,
      icon: TrashIcon,
      name: t("tools:tasks:header:delete:trash"),
      onClick: () => deleteTasks(),
    },
  ];

  const tabs = [
    {
      name: "Kanban",
      component: kanban,
      // disabled: true,
    },
    {
      name: t("tools:tasks:list"),
      component: table,
    },
  ];

  return (
    <TasksContextProvider>
      <Suspense fallback={<LoaderSpinner />}>
        <ToolHeader
          title={t("tools:tasks:name")}
          route="/tools/tasks/task"
          Filters={FiltersTasks}
          toolButtons={
            <>
              <IconDropdown
                icon={
                  selectedTasks[0]?.id && (
                    <TrashIcon
                      className="h-8 w-8 text-primary"
                      aria-hidden="true"
                    />
                  )
                }
                options={optionsTrash}
                width="w-72"
              />
              <IconDropdown
                icon={
                  <Cog8ToothIcon
                    className="h-8 w-8 text-primary"
                    aria-hidden="true"
                  />
                }
                options={optionsSettings}
                width="w-[340px]"
                colorIcon="text-green-100"
                excel={t("tools:tasks:header:excel:export")}
              />
            </>
          }
        />
        <TabPages tabs={tabs}>
          <div className="flex-none items-center justify-between  border-gray-200 hidden lg:flex">
            <TaskSubMenu />
          </div>
        </TabPages>
        {children}
      </Suspense>
    </TasksContextProvider>
  );
}
