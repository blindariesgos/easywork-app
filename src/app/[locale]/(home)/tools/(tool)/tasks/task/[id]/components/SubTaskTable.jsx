"use client";

import clsx from "clsx";
import React, { Fragment, useState } from "react";
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
            <Task key={task.id} task={task} columnTable={columnTable} />
          ))}
      </div>
    </div>
  );
}

const Task = ({ task, level = 0, ...props }) => {
  const [showSubTasks, setShowSubtaks] = useState(false);

  return (
    <Fragment>
      <Row
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
};

const Row = ({
  columnTable,
  task,
  showSubTasks,
  handleShowSubTasks,
  isSubTask,
  level,
}) => {
  const { t } = useTranslation();

  return (
    <Fragment>
      {columnTable.length > 0 &&
        columnTable.map((column, index) => (
          <div
            className={clsx("bg-[#f3f1f5] py-1 px-2", {
              "rounded-s-xl": index == 0,
              "rounded-e-xl": index === 3,
            })}
            key={index}
          >
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
        ))}
    </Fragment>
  );
};
