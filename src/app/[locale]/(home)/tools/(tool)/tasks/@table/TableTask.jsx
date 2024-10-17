"use client";

import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import React, { useLayoutEffect, useRef, useState, Fragment } from "react";
import { useTasksConfigs } from "@/src/hooks/useCommon";
import SelectedOptionsTable from "@/src/components/SelectedOptionsTable";
import AddColumnsTable from "@/src/components/AddColumnsTable";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import FooterTable from "@/src/components/FooterTable";
import {
  deleteTask as apiDeleteTask,
  putTaskCompleted,
  putTaskId,
  putTaskIdRelations,
} from "@/src/lib/apis"; // Ajusta el path según sea necesario
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useAlertContext } from "@/src/context/common/AlertContext";
import useTasksContext from "@/src/context/tasks";
import { getFormatDate } from "@/src/utils/getFormatDate";
import Task from "./Task";

export default function TableTask() {
  const checkbox = useRef();
  const { onCloseAlertDialog } = useAlertContext();
  const {
    tasks: data,
    mutate: mutateTasks,
    selectedTasks,
    setSelectedTasks,
    limit,
    setLimit,
    page,
    setPage,
    order,
    orderBy,
    setOrderBy,
  } = useTasksContext();

  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  const { columnTable } = useTasksConfigs();
  const [loading, setLoading] = useState(false);

  const [selectedColumns, setSelectedColumns] = useState(
    columnTable.filter((c) => c.check)
  );

  const { t } = useTranslation();

  useLayoutEffect(() => {
    if (selectedTasks.length > 0) {
      const isIndeterminate =
        selectedTasks.length > 0 && selectedTasks.length < data?.items.length;
      setChecked(selectedTasks.length === data?.items.length);
      setIndeterminate(isIndeterminate);
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedTasks, data]);

  const toggleAll = () => {
    const items = checked || indeterminate ? [] : data?.items?.map((x) => x.id);
    setSelectedTasks(items);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  };

  const deleteTasks = async () => {
    try {
      setLoading(true);
      if (selectedTasks.length === 1) {
        await apiDeleteTask(selectedTasks[0]);
      } else if (selectedTasks.length > 1) {
        await Promise.all(selectedTasks.map((task) => apiDeleteTask(task)));
      }
      toast.success(t("tools:tasks:table:delete-msg"));
      setSelectedTasks([]);
    } catch (error) {
      toast.error(t("tools:tasks:table:delete-error"));
    } finally {
      setLoading(false);
      onCloseAlertDialog();
      mutateTasks && mutateTasks();
    }
  };

  const completedTasks = async () => {
    try {
      setLoading(true);
      await Promise.all(
        selectedTasks.map((taskId) => putTaskCompleted(taskId))
      );
      toast.success(t("tools:tasks:table:completed-msg"));
      setSelectedTasks([]);
    } catch (error) {
      toast.error(t("tools:tasks:table:completed-error"));
    } finally {
      setLoading(false);
      onCloseAlertDialog();
      mutateTasks && mutateTasks();
    }
  };

  const addRelationTasks = async (user, relation) => {
    try {
      setLoading(true);
      const body = {
        usersIds: [user.id],
        relation,
      };

      await Promise.all(
        selectedTasks.map((taskId) => putTaskIdRelations(taskId, body))
      );
      toast.success(t("tools:tasks:table:responsible-msg"));
      setSelectedTasks([]);
    } catch (error) {
      toast.error(t("tools:tasks:table:responsible-error"));
    } finally {
      setLoading(false);
      mutateTasks && mutateTasks();
    }
  };

  const changeResponsibleTasks = async (responsible) => {
    try {
      setLoading(true);
      const body = {
        responsibleIds: [responsible.id],
      };

      await Promise.all(selectedTasks.map((taskId) => putTaskId(taskId, body)));
      toast.success(t("tools:tasks:table:responsible-msg"));
      setSelectedTasks([]);
    } catch (error) {
      toast.error(t("tools:tasks:table:responsible-error"));
    } finally {
      setLoading(false);
      mutateTasks && mutateTasks();
    }
  };

  const changeCreatorTasks = async (creator) => {
    try {
      setLoading(true);
      const body = {
        createdById: creator.id,
      };

      await Promise.all(selectedTasks.map((taskId) => putTaskId(taskId, body)));
      toast.success(t("tools:tasks:table:responsible-msg"));
      setSelectedTasks([]);
    } catch (error) {
      toast.error(t("tools:tasks:table:responsible-error"));
    } finally {
      setLoading(false);
      mutateTasks && mutateTasks();
    }
  };

  const changeDeadlineTasks = async (deadline) => {
    try {
      setLoading(true);

      const body = {
        deadline: getFormatDate(deadline),
      };

      await Promise.all(selectedTasks.map((taskId) => putTaskId(taskId, body)));
      toast.success(t("tools:tasks:table:responsible-msg"));
      setSelectedTasks([]);
    } catch (error) {
      toast.error(t("tools:tasks:table:responsible-error"));
    } finally {
      setLoading(false);
      mutateTasks && mutateTasks();
    }
  };

  const optionsCheckBox = [
    {
      id: 1,
      name: t("common:table:checkbox:complete"),
      onclick: () => completedTasks(),
    },
    {
      id: 2,
      name: t("common:table:checkbox:add-observer"),
      selectUser: true,
      onclick: (e) => addRelationTasks(e, "observadores"),
    },
    {
      id: 3,
      name: t("common:table:checkbox:add-participant"),
      selectUser: true,
      onclick: (e) => addRelationTasks(e, "participantes"),
    },
    {
      id: 4,
      name: t("common:table:checkbox:change-creator"),
      selectUser: true,
      onclick: (e) => changeCreatorTasks(e),
    },
    {
      id: 5,
      name: t("common:table:checkbox:change-deadline"),
      selectDate: true,
      onclick: (e) => changeDeadlineTasks(e),
    },
    {
      id: 2,
      name: t("common:table:checkbox:change-responsible"),
      selectUser: true,
      onclick: (e) => changeResponsibleTasks(e),
    },
    {
      id: 6,
      name: t("common:table:checkbox:delete"),
      onclick: () => deleteTasks(),
    },
  ];

  return (
    <Fragment>
      {selectedColumns && selectedColumns.length > 0 && (
        <div className="flow-root">
          {loading && <LoaderSpinner />}
          <div className="min-w-full py-2">
            {selectedTasks.length > 0 && (
              <div className="p-2 flex">
                <SelectedOptionsTable options={optionsCheckBox} />
              </div>
            )}
            <div className="sm:rounded-lg ">
              <div className="overflow-x-auto min-h-[60vh] h-full">
                <table className="min-w-full rounded-md bg-gray-100 table-auto relative ">
                  <thead className="text-sm bg-white drop-shadow-sm sticky top-0 z-10">
                    <tr>
                      <th
                        scope="col"
                        className="flex justify-center items-center gap-2  px-4 rounded-s-xl py-4"
                      >
                        <input
                          type="checkbox"
                          className=" h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          ref={checkbox}
                          checked={checked}
                          onChange={toggleAll}
                        />
                        <AddColumnsTable
                          columns={columnTable.map((x) => ({
                            ...x,
                            check: selectedColumns
                              .map((s) => s.id)
                              .includes(x.id),
                          }))}
                          setSelectedColumns={setSelectedColumns}
                        />
                      </th>
                      {selectedColumns.length > 0 &&
                        selectedColumns.map((column, index) => (
                          <th
                            key={index}
                            scope="col"
                            className={`min-w-[12rem] py-3.5 pr-3 text-sm font-medium text-primary cursor-pointer  ${
                              index === selectedColumns.length - 1 &&
                              "rounded-e-xl"
                            }`}
                            onClick={() => {
                              setOrderBy(column.row);
                            }}
                          >
                            <div
                              className={clsx(
                                "flex justify-left items-center gap-2",
                                {
                                  "font-bold": orderBy === column.row,
                                }
                              )}
                            >
                              {column.name}
                              <div>
                                <ChevronDownIcon
                                  className={`h-6 w-6 text-primary ${
                                    orderBy === column.row && order !== "DESC"
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
                      data?.items?.length > 0 &&
                      data?.items?.map((task, index) => (
                        <Task
                          key={task.id}
                          task={task}
                          setLoading={setLoading}
                          selectedColumns={selectedColumns}
                          mutateTasks={mutateTasks}
                          selectedTasks={selectedTasks}
                          setSelectedTasks={setSelectedTasks}
                        />
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="w-full mt-2">
            <FooterTable
              limit={limit}
              setLimit={setLimit}
              page={page}
              setPage={setPage}
              totalPages={data?.meta?.totalPages}
              total={data?.meta?.totalItems ?? 0}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
}
