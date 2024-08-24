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

export default function General({ user, id }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("DESC");
  const { tasks, isLoading } = useTasks({
    filters: { responsible: id },
    page,
    limit,
    config: { orderBy, order },
  });

  const getLastActivity = (task) => {
    if (task.completedTime) return formatDate(task.createdAt);
    return formatDate(task.createdAt);
  };

  const columns = [
    {
      name: "Nombre",
      key: "name",
    },
    {
      name: "Actividad",
      key: "",
    },
    {
      name: "Fecha limite",
      key: "deadline",
    },
  ];

  return (
    <Fragment>
      {isLoading && <LoaderSpinner />}
      <div className="h-full relative">
        <div className="relative overflow-x-auto drop-shadow-sm rounded-xl">
          <table className="min-w-full rounded-md table-auto bg-gray-100">
            <thead className="text-sm bg-white drop-shadow-sm rounded-xl">
              <tr className="">
                {columns.map((column, index) => (
                  <th
                    scope="col"
                    className={clsx(
                      "py-3.5 pl-4 pr-3 text-center text-sm font-medium text-gray-400 cursor-pointer ",
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
                    <div className="group inline-flex items-center">
                      {column.name}
                      <span
                        className={`ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${
                          orderBy === column.key && order === "DESC"
                            ? "transform rotate-180"
                            : ""
                        } ${orderBy != column.key && "invisible"}`}
                      >
                        <ChevronDownIcon
                          className="h-6 w-6"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            {tasks && tasks.items && tasks.items.length && (
              <tbody className="bg-gray-100">
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
                        className={clsx(
                          "p-1 px-2 rounded-full text-sm w-auto",
                          {
                            "bg-red-200 text-red-900":
                              isDateOverdue(task.deadline) &&
                              !task.completedTime,
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
                          }
                        )}
                      >
                        {getTaskOverdueTimeDelta(task)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </Fragment>
  );
}
