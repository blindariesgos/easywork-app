"use client";

import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import React, { Fragment } from "react";
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
    <div className={`grid grid-cols-1`}>
      <div className="grid grid-cols-4 rounded-xl gap-y-1 text-xs">
        {columnTable.length > 0 &&
          columnTable.map((column, index) => (
            <p
              className={clsx("p-2 bg-white", {
                "rounded-s-xl": index === 0,
                "rounded-e-xl": index === 3,
              })}
              key={column.id}
            >
              {column.name}
            </p>
          ))}
        {columnTable.length > 0 &&
          tasks?.length > 0 &&
          tasks?.map((task) => (
            <Fragment key={task.id}>
              {columnTable.length > 0 &&
                columnTable.map((column, index) => (
                  <div
                    className={clsx("bg-[#f3f1f5] py-1 px-2", {
                      "rounded-s-xl": index == 0,
                      "rounded-e-xl": index === 3,
                    })}
                    key={index}
                  >
                    {renderCellContent(column, task, t)}
                  </div>
                ))}
            </Fragment>
          ))}
      </div>
    </div>
  );
}
