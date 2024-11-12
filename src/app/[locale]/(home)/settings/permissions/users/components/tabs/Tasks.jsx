"use client";
import { PencilIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useTasks } from "../../../../../../../../lib/api/hooks/tasks";
import {
  formatDate,
  getTaskOverdueTimeDelta,
  isDateOverdue,
  isDateTomorrowOverdue,
  isDateTodayOverdue,
  isDateMoreFiveDayOverdue,
  isDateMoreTenDayOverdue,
} from "../../../../../../../../utils/getFormatDate";
import Link from "next/link";
import clsx from "clsx";
import { PaginationV2 } from "@/src/components/pagination/PaginationV2";

export default function General({ user, id }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("DESC");
  const { tasks, isLoading } = useTasks({
    filters: { responsible: id },
    page,
    limit,
    config: { orderBy, order },
  });

  const getLastActivity = (task) => {
    if (task.completedTime) return formatDate(task.completedTime);
    return formatDate(task.updatedAt);
  };

  const columns = [
    {
      name: "Nombre",
      key: "name",
    },
    {
      name: "Actividad",
      key: "updatedAt",
    },
    {
      name: "Fecha límite",
      key: "deadline",
    },
  ];

  return (
    <Fragment>
      {isLoading && <LoaderSpinner />}
      <div className="overflow-auto drop-shadow-sm rounded-xl lg:h-[calc(100vh_-_160px)]">
        <table className="w-full rounded-xl table-auto bg-gray-100">
          <thead className="text-sm bg-white drop-shadow-sm rounded-xl">
            <tr className="">
              {columns.map((column, index) => (
                <th
                  key={column.id}
                  scope="col"
                  className={clsx(
                    "py-3.5 pl-4 pr-3 text-sm font-medium text-gray-400 cursor-pointer ",
                    {
                      "rounded-bl-xl": index === 0,
                      "rounded-br-xl": index === columns.length - 1,
                    }
                  )}
                  onClick={() => {
                    setOrder(
                      orderBy == column.key
                        ? order === "DESC"
                          ? "ASC"
                          : "DESC"
                        : "DESC"
                    );
                    setOrderBy(column.key);
                  }}
                >
                  <div className="group flex items-center">
                    {column.name}
                    <span
                      className={`ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${
                        orderBy === column.key && order === "ASC"
                          ? "transform rotate-180"
                          : ""
                      } ${orderBy != column.key && "invisible"}`}
                    >
                      <ChevronDownIcon className="h-6 w-6" aria-hidden="true" />
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          {tasks && tasks.items && tasks.items.length ? (
            <tbody className="bg-gray-100 rounded-b-xl">
              {tasks.items.map((task, index) => (
                <tr key={index} className="even:bg-gray-300">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-black text-center cursor-pointer">
                    <Link href={`/tools/tasks/task/${task.id}?show=true`}>
                      <div className="flex gap-2 px-2 hover:text-primary">
                        {task.name}
                      </div>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
                    <div className="p-1 px-2 text-sm font-normal">
                      {getLastActivity(task)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
                    <span
                      className={clsx("p-1 px-2 rounded-full text-sm w-auto", {
                        "bg-red-200 text-red-900":
                          isDateOverdue(task.deadline) && !task.completedTime,
                        "bg-green-200 text-green-900":
                          isDateTomorrowOverdue(task.deadline) &&
                          !task.completedTime,
                        "bg-orange-300 text-orange-900":
                          isDateTodayOverdue(task.deadline) &&
                          !task.completedTime,
                        "bg-blue-300 text-blue-900":
                          isDateMoreFiveDayOverdue(task.deadline) &&
                          !task.completedTime,
                        "bg-gray-300":
                          !task.deadline ||
                          (isDateMoreTenDayOverdue(task.deadline) &&
                            !task.completedTime),
                        "text-gray-800/45 line-through": task.isCompleted,
                      })}
                    >
                      {getTaskOverdueTimeDelta(task)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td
                  className="py-4 md:py-8 xl:py-16 flex justify-center"
                  colSpan={columns.length}
                >
                  <p className="text-xl font-bold text-gray-600">
                    No posee tareas asignadas
                  </p>
                </td>
              </tr>
            </tbody>
          )}
        </table>
        {tasks && tasks.items && tasks.items.length > 0 && (
          <div className="w-full p-2 flex justify-center">
            <PaginationV2
              totalPages={tasks?.meta?.totalPages || 0}
              currentPage={page}
              setPage={setPage}
              bgColor="bg-white"
            />
          </div>
        )}
      </div>
    </Fragment>
  );
}
