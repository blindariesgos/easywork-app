"use client";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import Link from "next/link";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ToolContextProvider from "@/src/context/tools";
import {  useTasksConfigs} from "@/src/hooks/useCommon";
import { Pagination } from "@/src/components/pagination/Pagination";
import SelectedOptionsTable from "@/src/components/SelectedOptionsTable";
import AddColumnsTable from "@/src/components/AddColumnsTable";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import Image from "next/image";
import { useOrderByColumn } from "@/src/hooks/useOrderByColumn";
import { deleteTask as apiDeleteTask } from '@/src/lib/apis'; // Ajusta el path según sea necesario
import { useSWRConfig } from "swr";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useAlertContext } from "@/src/context/common/AlertContext";
import { formatDate, getTaskOverdueTimeDelta, isDateOverdue } from "@/src/utils/getFormatDate";

export default function TableTask({ data }) {
  const checkbox = useRef();
  const { onCloseAlertDialog } = useAlertContext();
  const {
    selectedTasks,
    setSelectedTasks
  } = ToolContextProvider();
  const { mutate } = useSWRConfig();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [dataTask, setDataTask] = useState();
  const { fieldClicked, handleSorting, orderItems } = useOrderByColumn(
    [],
    data?.items
  );
  const { columnTable } = useTasksConfigs();
  const [loading, setLoading] = useState(false);

  const [selectedColumns, setSelectedColumns] = useState(
    columnTable.filter((c) => c.check)
  );
  const { t } = useTranslation();

useEffect(() => {
    if (data) setDataTask(data);
  }, [data]);

   useEffect(
    () => {
      if (orderItems.length > 0)
        setDataTask({ items: orderItems, meta: data?.meta });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderItems]
  );

    useLayoutEffect(() => {
    if (selectedTasks.length > 0) {
      const isIndeterminate =
        selectedTasks.length > 0 &&
        selectedTasks.length < dataTask?.items.length;
      setChecked(selectedTasks.length === dataTask?.items.length);
      setIndeterminate(isIndeterminate);
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedTasks, dataTask]);

  const toggleAll = () => {
    setSelectedTasks(checked || indeterminate ? [] : dataTask?.items);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  const deleteTasks = async () => {
    try {
      setLoading(true);
      if (selectedTasks.length === 1) {
        await apiDeleteTask(selectedTasks[0].id);
      } else if (selectedTasks.length > 1) {
        await Promise.all(selectedTasks.map((task) => apiDeleteTask(task.id)));
      }
      toast.success("Tarea(s) eliminada(s) con éxito");
      setSelectedTasks([]);
      await mutate(`/tools/tasks/user?limit=15&page=1`);
    } catch (error) {
      console.error(error.message);
      toast.error("Error al eliminar la(s) tarea(s)");
    } finally {
      setLoading(false);
      onCloseAlertDialog();
    }
  };

    const optionsCheckBox = [
    {
      id: 1,
      name: t("common:table:checkbox:complete"),
    },
    {
      id: 2,
      name: t("common:table:checkbox:add-observer"),
      selectUser: true,
    },
    {
      id: 3,
      name: t("common:table:checkbox:add-participant"),
      selectUser: true,
    },
    {
      id: 4,
      name: t("common:table:checkbox:change-observer"),
      selectUser: true,
    },
    {
      id: 5,
      name: t("common:table:checkbox:change-participant"),
      selectUser: true,
    },
    {
      id: 6,
      name: t("common:table:checkbox:delete"),
      onclick: () => deleteTasks(),
    },
  ];

  return (
    <>
      {selectedColumns && selectedColumns.length > 0 && (
        <div className="flow-root">
          {loading && <LoaderSpinner />}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="relative sm:rounded-lg h-[60vh]">
                <table className="min-w-full rounded-md bg-gray-100 table-auto ">
                  <thead className="text-sm bg-white drop-shadow-sm">
                    <tr>
                      <th
                        scope="col"
                        className="relative px-7 sm:w-12 sm:px-6 rounded-s-xl py-5"
                      >
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          ref={checkbox}
                          checked={checked}
                          onChange={toggleAll}
                        />
                        <AddColumnsTable
                          columns={columnTable}
                          setSelectedColumns={setSelectedColumns}
                        />
                      </th>
                      {selectedColumns.length > 0 &&
                        selectedColumns.map((column, index) => (
                          <th
                            key={index}
                            scope="col"
                            className={`min-w-[12rem] py-3.5 pr-3 text-sm font-medium text-primary cursor-pointer  ${index === selectedColumns.length - 1 &&
                              "rounded-e-xl"
                              }`}
                            onClick={() => {
                              handleSorting(column.row);
                            }}
                          >
                            <div className="flex justify-left items-center gap-2">
                              {column.name}
                              <div>
                                <ChevronDownIcon
                                  className={`h-6 w-6 text-primary ${fieldClicked.field === column.row &&
                                    fieldClicked.sortDirection === "desc"
                                    ? "transform rotate-180"
                                    : ""
                                    }`}
                                />
                              </div>
                            </div>
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="bg-gray-100">
                    {selectedColumns.length > 0 &&
                      dataTask?.items?.length > 0 &&
                      dataTask?.items?.map((task, index) => (
                        <tr
                          key={index}
                          className={clsx(
                            selectedTasks.includes(task)
                              ? "bg-gray-200"
                              : undefined,
                            "hover:bg-indigo-100/40 cursor-default"
                          )}
                        >
                          <td className=" px-7 sm:w-12 sm:px-6">
                            {selectedTasks.includes(task) && (
                              <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                            )}
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              value={task.id}
                              checked={selectedTasks.includes(task)}
                              onChange={(e) =>
                                setSelectedTasks(
                                  e.target.checked
                                    ? [...selectedTasks, task]
                                    : selectedTasks.filter((p) => p !== task)
                                )
                              }
                            />
                          </td>
                          {selectedColumns.length > 0 &&
                            selectedColumns.map((column, index) => (
                              <td className="ml-4 text-left py-5" key={index}>
                                <div className="font-medium text-sm text-black hover:text-primary capitalize">
                                  {renderCellContent(column, task, t)}
                                </div>
                              </td>
                            ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="w-full mt-2">
            <div className="flex justify-center">
              <Pagination totalPages={dataTask?.meta?.totalPages || 0} />
            </div>
            <div className="flex">
              {selectedTasks.length > 0 && (
                <SelectedOptionsTable options={optionsCheckBox} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const renderCellContent = (column, task, t) => {
  const { row, link } = column;
  const taskValue = task[row];

  switch (row) {
    case "responsible":
      return (
        <div className="flex items-center justify-center">
          <div className="font-medium text-black">
            {taskValue.length > 0 ? taskValue.map((item) => item.username).join(", ") : ""}
          </div>
        </div>
      );
    case "createdBy":
      return (
        <div className="flex gap-x-2 items-center justify-left">
          <Image
            className="h-6 w-6 rounded-full bg-zinc-200"
            width={30}
            height={30}
            src={taskValue?.avatar || "/img/avatar.svg"}
            alt="avatar"
          />
          <div className="font-medium text-black">
            {taskValue?.name}
          </div>
        </div>
      );
    case "deadline":
      return taskValue ? (
        <div className="flex">
          <span className={clsx(isDateOverdue(taskValue) ? "bg-red-200 text-red-900" : "bg-blue-200", "p-1 px-2 rounded-full text-sm w-auto")}>
          {getTaskOverdueTimeDelta(task)}
          </span>
        </div>
      ) : (
        <div className="flex">
          <span className="p-1 px-2 bg-gray-300 rounded-full text-sm w-auto">
            {t("tools:tasks:table:no-deadline")}
          </span>
        </div>
      );
       

    case "activity":
      return (
        <div className="p-1 px-2 text-sm font-normal">
          {getLastActivity(task)}
        </div>
      );
        
    case "startTime":
      return taskValue ? formatDate(taskValue, "dd/MM/yyyy hh:mm:ss a") : "";

    case "contact":
      if (task?.crm?.length === 0) return "No especificado";
      return task.crm[0]?.type === "contact" && <div className="flex gap-x-2 items-center justify-left">
        <Image
            className="h-6 w-6 rounded-full bg-zinc-200"
            width={30}
            height={30}
            src={taskValue?.avatar || "/img/avatar.svg"}
            alt="avatar"
          />
{task.crm[0]?.contact?.fullName}
      </div>  || "No especificado";

    case "policy":
      return taskValue || "No especificado";

    default:
      return link ? (
        <Link className={clsx(task.status === "pending_review" ? "text-gray-800/45 line-through" : "text-black")} href={`/tools/tasks/task/${task.id}?show=true`}>
          {taskValue}
        </Link>
      ) : (
        taskValue
      );
  }
};

const getLastActivity = (task) =>{
  if (task.completedTime) return formatDate(task.createdAt);
  return formatDate(task.createdAt);
}