"use client";

import { ChevronDownIcon, Bars3Icon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import React, { useLayoutEffect, useRef, useState, Fragment } from "react";
import { useTasksConfigs } from "@/src/hooks/useCommon";
import SelectedOptionsTable from "@/src/components/SelectedOptionsTable";
import AddColumnsTable from "@/src/components/AddColumnsTable";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import FooterTable from "@/src/components/FooterTable";
import { useOrderByColumn } from "@/src/hooks/useOrderByColumn";
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
import { renderCellContent } from "./utils";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { getFormatDate } from "@/src/utils/getFormatDate";

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
  const router = useRouter();
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

  const handleDeleteTask = async (id) => {
    try {
      setLoading(true);
      await apiDeleteTask(id);
      toast.success(t("tools:tasks:table:delete-msg"));
      mutateTasks && mutateTasks();
    } catch {
      toast.error(t("tools:tasks:table:delete-error"));
    }
    setLoading(false);
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

  const itemOptions = [
    {
      name: "Ver",
      handleClick: (id) => router.push(`/tools/tasks/task/${id}?show=true`),
    },
    {
      name: "Editar",
      handleClick: (id) =>
        router.push(`/tools/tasks/task/${id}?show=true&action=edit`),
    },
    {
      name: "Copiar",
      handleClick: (id) =>
        router.push(`/tools/tasks/task/${id}?show=true&action=copy`),
    },
    { name: "Eliminar", handleClick: (id) => handleDeleteTask(id) },
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
                <table className="min-w-full rounded-md bg-gray-100 table-auto  ">
                  <thead className="text-sm bg-white drop-shadow-sm">
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
                        <tr
                          key={index}
                          className={clsx(
                            selectedTasks.includes(task.id)
                              ? "bg-gray-200"
                              : undefined,
                            "hover:bg-indigo-100/40 cursor-default relative"
                          )}
                        >
                          <td className="relative  px-4 sm:w-12 ">
                            {selectedTasks.includes(task.id) && (
                              <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                            )}
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                value={task.id}
                                checked={selectedTasks.includes(task.id)}
                                onChange={(e) =>
                                  setSelectedTasks(
                                    e.target.checked
                                      ? [...selectedTasks, task.id]
                                      : selectedTasks.filter(
                                          (p) => p !== task.id
                                        )
                                  )
                                }
                              />
                              <Menu
                                as="div"
                                className="relative hover:bg-slate-50/30 w-10 md:w-auto py-2 px-1 rounded-lg"
                              >
                                <MenuButton className="flex items-center p-1.5">
                                  <Bars3Icon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </MenuButton>

                                <MenuItems
                                  transition
                                  anchor="right start"
                                  className=" z-50 w-48 rounded-md bg-white py-2 shadow-lg focus:outline-none"
                                >
                                  {itemOptions.map((item) => (
                                    <MenuItem
                                      key={item.name}
                                      onClick={() =>
                                        item.handleClick &&
                                        item.handleClick(task.id)
                                      }
                                    >
                                      <div
                                        // onClick={item.onClick}
                                        className={clsx(
                                          "data-[focus]:bg-gray-100  block px-3 py-1 text-sm leading-6 text-black cursor-pointer"
                                        )}
                                      >
                                        {item.name}
                                      </div>
                                    </MenuItem>
                                  ))}
                                </MenuItems>
                              </Menu>
                            </div>
                          </td>
                          {selectedColumns.length > 0 &&
                            selectedColumns.map((column, index) => (
                              <td className="ml-4 text-left py-2" key={index}>
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
