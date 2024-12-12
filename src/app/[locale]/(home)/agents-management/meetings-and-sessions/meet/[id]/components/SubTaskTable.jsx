"use client";

import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";
import { renderCellContent } from "../../../@table/utils";

export default function SubTaskTable({ tasks }) {
  const { t } = useTranslation();
  const columnTable = [
    {
      id: 1,
      name: t("tools:tasks:table:name"),
      row: "name",
      check: true,
      link: true,
      permanent: true,
    },
    {
      id: 5,
      name: t("tools:tasks:table.limit-date"),
      row: "deadline",
      check: true,
    },
    {
      id: 6,
      name: t("tools:tasks:table.created-by"),
      row: "createdBy",
      photo: true,
      check: true,
    },
    {
      id: 7,
      name: t("tools:tasks:table.responsible"),
      row: "responsible",
      check: true,
      photo: true,
    },
  ];

  return (
    <table className="min-w-full rounded-md  table-auto shadow-md">
      <thead className="text-sm bg-white drop-shadow-sm">
        <tr>
          {columnTable.length > 0 &&
            columnTable.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={`py-2 pr-3 text-sm font-medium text-primary cursor-pointer  ${
                  index === columnTable.length - 1 && "rounded-e-xl"
                }`}
              >
                <div
                  className={clsx(
                    "flex justify-left items-center gap-2 pl-2 text-sm"
                  )}
                >
                  {column.name}
                </div>
              </th>
            ))}
        </tr>
      </thead>
      <tbody className="bg-gray-100">
        {columnTable.length > 0 &&
          tasks?.length > 0 &&
          tasks?.map((task) => (
            <tr
              key={task.id}
              className={clsx(
                "hover:bg-indigo-100/40 cursor-default relative bg-gray-100"
              )}
            >
              {columnTable.length > 0 &&
                columnTable.map((column, index) => (
                  <td className="text-left pl-2" key={index}>
                    <div className="font-medium text-sm text-black hover:text-primary capitalize">
                      {renderCellContent(column, task, t)}
                    </div>
                  </td>
                ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
}
