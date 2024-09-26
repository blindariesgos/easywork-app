"use client";

import {
  ChevronDownIcon,
  CheckIcon,
  Bars3Icon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  Fragment,
} from "react";
import { useTasksConfigs } from "@/src/hooks/useCommon";
import { PaginationV2 } from "@/src/components/pagination/PaginationV2";
import SelectedOptionsTable from "@/src/components/SelectedOptionsTable";
import AddColumnsTable from "@/src/components/AddColumnsTable";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useOrderByColumn } from "@/src/hooks/useOrderByColumn";
import {
  deleteTask as apiDeleteTask,
  putTaskCompleted,
  putTaskId,
} from "@/src/lib/apis"; // Ajusta el path según sea necesario
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useAlertContext } from "@/src/context/common/AlertContext";
import useTasksContext from "@/src/context/tasks";
import { renderCellContent } from "./utils";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { itemsByPage } from "@/src/lib/common";
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
  } = useTasksContext();
  const router = useRouter();
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
      if (orderItems?.length > 0)
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
    setSelectedTasks(
      checked || indeterminate ? [] : dataTask?.items?.map((x) => x.id)
    );
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
    // {
    //   id: 2,
    //   name: t("common:table:checkbox:add-observer"),
    //   selectUser: true,
    // },
    // {
    //   id: 3,
    //   name: t("common:table:checkbox:add-participant"),
    //   selectUser: true,
    // },
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
                          columns={columnTable}
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
                              handleSorting(column.row);
                            }}
                          >
                            <div className="flex justify-left items-center gap-2">
                              {column.name}
                              <div>
                                <ChevronDownIcon
                                  className={`h-6 w-6 text-primary ${
                                    fieldClicked.field === column.row &&
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
              <div className="flex gap-1 items-center">
                <p>Mostrar:</p>
                <Listbox value={limit} onChange={setLimit} as="div">
                  <ListboxButton
                    className={clsx(
                      "relative block w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6",
                      "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2"
                    )}
                  >
                    {limit}
                    <ChevronDownIcon
                      className="group pointer-events-none absolute top-2.5 right-2.5 size-4 "
                      aria-hidden="true"
                    />
                  </ListboxButton>
                  <ListboxOptions
                    anchor="bottom"
                    transition
                    className={clsx(
                      "rounded-xl border border-white p-1 focus:outline-none bg-white shadow-2xl",
                      "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
                    )}
                  >
                    {itemsByPage.map((page) => (
                      <ListboxOption
                        key={page.name}
                        value={page.id}
                        className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-primary data-[focus]:text-white"
                      >
                        <CheckIcon className="invisible size-4 group-data-[selected]:visible" />
                        <div className="text-sm/6">{page.name}</div>
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </Listbox>
              </div>
              <PaginationV2
                totalPages={dataTask?.meta?.totalPages || 0}
                currentPage={page}
                setPage={setPage}
              />
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
