"use client";

import { Bars3Icon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import React, { useState, Fragment } from "react";
import { deleteTask as apiDeleteTask } from "@/src/lib/apis"; // Ajusta el path según sea necesario
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { renderCellContent } from "./utils";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useRouter } from "next/navigation";

export default function Task({ task, level = 0, ...props }) {
  const [showSubTasks, setShowSubtaks] = useState(false);

  return (
    <Fragment>
      <ColumnTable
        task={task}
        {...props}
        handleShowSubTasks={() => setShowSubtaks(!showSubTasks)}
        showSubTasks={showSubTasks}
        level={level}
      />
      {task?.subTasks?.length > 0 && showSubTasks && (
        <Fragment>
          {task.subTasks.map((subTask) => (
            <Task
              task={subTask}
              isSubTask={true}
              {...props}
              key={subTask.id}
              level={level + 1}
            />
          ))}
        </Fragment>
      )}
    </Fragment>
  );
}

const ColumnTable = ({
  selectedColumns,
  selectedTasks,
  setSelectedTasks,
  task,
  handleShowSubTasks,
  isSubTask,
  showSubTasks,
  setDeleteId,
  setIsOpenDelete,
  level,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

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
    {
      name: "Eliminar",
      handleClick: (id) => {
        setDeleteId(id);
        setIsOpenDelete(true);
      },
    },
  ];

  return (
    <tr
      className={clsx("hover:bg-indigo-100/40 cursor-default relative", {
        "bg-gray-200": selectedTasks.includes(task.id),
      })}
    >
      <td className="relative px-4 sm:w-12 ">
        {selectedTasks.includes(task.id) && (
          <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
        )}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            value={task.id}
            checked={selectedTasks.includes(task.id)}
            onChange={(e) =>
              setSelectedTasks(
                e.target.checked
                  ? [...selectedTasks, task.id]
                  : selectedTasks.filter((p) => p !== task.id)
              )
            }
          />
          <Menu
            as="div"
            className="relative hover:bg-slate-50/30 py-2  rounded-lg"
          >
            <MenuButton className="flex items-center">
              <Bars3Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </MenuButton>

            <MenuItems
              transition
              anchor="right start"
              className=" z-50 rounded-md bg-white py-2 shadow-lg focus:outline-none"
            >
              {itemOptions.map((item) => (
                <MenuItem
                  key={item.name}
                  onClick={() => item.handleClick && item.handleClick(task.id)}
                >
                  <div
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
              {renderCellContent(
                column,
                task,
                t,
                handleShowSubTasks,
                showSubTasks,
                isSubTask,
                level
              )}
            </div>
          </td>
        ))}
    </tr>
  );
};
