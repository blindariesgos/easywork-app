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
import ActiveFiltersDrawer from "@/src/components/ActiveFiltersDrawer";
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
      name: t("tools:tasks:list"),
      component: table,
    },
    {
      name: t("tools:tasks:limit-date"),
      component: kanban,
      // disabled: true,
    },
  ];

  return (
    <div className="flex flex-col flex-grow h-full">
      <TasksContextProvider>
        <Suspense fallback={<LoaderSpinner />}>
          <TabGroup
            defaultIndex={0}
            className="w-full flex flex-col items-start"
          >
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
            >
              <div className="flex-none items-center justify-between  border-gray-200 py-4 hidden lg:flex">
                <TaskSubMenu>
                  <TabList className="bg-zinc-300/40 rounded-full flex gap-1 items-center p-1 ">
                    {tabs.map((tab) => (
                      <Tab
                        key={tab.name}
                        className="data-[selected]:bg-white py-2 px-3 rounded-full text-xs outline-none focus:outline-none hover:outline-none"
                        disabled={tab.disabled}
                      >
                        {tab.name}
                      </Tab>
                    ))}
                  </TabList>
                </TaskSubMenu>
              </div>
            </ToolHeader>

            <TabPanels className="w-full">
              {tabs.map((tab) => (
                <TabPanel key={tab.name} className="w-full">
                  {tab.component}
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>
          {children}
        </Suspense>
      </TasksContextProvider>
    </div>
  );
}
