"use client";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

import Image from "next/image";
import {
  formatDate,
  getTaskOverdueTimeDelta,
  isDateOverdue,
  isDateTomorrowOverdue,
  isDateTodayOverdue,
  isDateMoreFiveDayOverdue,
  isDateMoreTenDayOverdue,
} from "@/src/utils/getFormatDate";

export const renderCellContent = (column, task, t) => {
  const { row, link } = column;
  const taskValue = task[row];

  switch (row) {
    case "responsible":
      if (taskValue.length === 0) return "No especificado";
      return (
        <div className="flex gap-x-2 items-center justify-left">
          <Image
            className="h-6 w-6 rounded-full bg-zinc-200"
            width={30}
            height={30}
            src={taskValue[0]?.avatar || "/img/avatar.svg"}
            alt="avatar"
          />
          <div className="font-medium text-black">{taskValue[0]?.name}</div>
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
          <div className="font-medium text-black">{taskValue?.name}</div>
        </div>
      );
    case "deadline":
      return taskValue ? (
        <div className="flex">
          <span
            className={clsx("p-1 px-2 rounded-full text-sm w-auto", {
              "bg-red-200 text-red-900":
                isDateOverdue(taskValue) && !task.completedTime,
              "bg-green-200 text-green-900":
                isDateTomorrowOverdue(taskValue) && !task.completedTime,
              "bg-orange-300 text-orange-900":
                isDateTodayOverdue(taskValue) && !task.completedTime,
              "bg-blue-300 text-blue-900":
                isDateMoreFiveDayOverdue(taskValue) && !task.completedTime,
              "text-gray-800/45 line-through": task.isCompleted,
              "bg-gray-300":
                !taskValue ||
                (isDateMoreTenDayOverdue(taskValue) && !task.completedTime),
            })}
          >
            {getTaskOverdueTimeDelta(task)}
          </span>
        </div>
      ) : (
        <div className="flex">
          <span
            className={clsx("p-1 px-2  rounded-full text-sm w-auto", {
              "bg-gray-300": !task.completedTime,
              "line-through text-gray-800/45": task.completedTime,
            })}
          >
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

    case "important":
      return !!taskValue ? t("common:yes") : t("common:no");

    case "contact":
      if (task?.crm?.length === 0) return "No especificado";
      const contact = task.crm.find((item) => item.type == "contact");
      console.log("cmr-task-contact", task, contact);
      return (
        (contact && (
          <Link
            href={`/sales/crm/contacts/contact/${contact?.crmEntity?.id}?show=true&prev=tasks`}
          >
            <div className="flex gap-x-2 items-center justify-left">
              <Image
                className="h-6 w-6 rounded-full bg-zinc-200"
                width={30}
                height={30}
                src={contact?.crmEntity?.photo || "/img/avatar.svg"}
                alt="avatar"
              />
              {contact?.crmEntity?.fullName ??
                contact?.crmEntity?.name ??
                "No Disponible"}
            </div>
          </Link>
        )) ||
        "No especificado"
      );

    case "policy":
      if (task?.crm?.length === 0) return "No especificado";
      const policy = task.crm.find((item) => item.type == "poliza");

      return (
        (policy && (
          <Link
            href={`/operations/policies/policy/${policy?.crmEntity?.id}?show=true`}
          >
            <div className="flex gap-x-2 items-center justify-left">
              {policy?.crmEntity?.name}
            </div>
          </Link>
        )) ||
        "No especificado"
      );

    case "lead":
      if (task?.crm?.length === 0) return "No especificado";
      const lead = task.crm.find((item) => item.type == "lead");
      return (
        (lead && (
          <Link href={`/sales/crm/leads/lead/${lead?.crmEntity?.id}?show=true`}>
            <div className="flex gap-x-2 items-center justify-left">
              <Image
                className="h-6 w-6 rounded-full bg-zinc-200"
                width={30}
                height={30}
                src={lead?.crmEntity?.photo || "/img/avatar.svg"}
                alt="avatar"
              />
              {lead?.crmEntity?.fullName ?? lead?.crmEntity?.name}
            </div>
          </Link>
        )) ||
        "No especificado"
      );

    default:
      return link ? (
        <Link
          className={clsx(
            task.status === "pending_review"
              ? "text-gray-800/45 line-through"
              : "text-black"
          )}
          href={`/tools/tasks/task/${task.id}?show=true`}
        >
          {taskValue}
        </Link>
      ) : (
        taskValue
      );
  }
};

export const getLastActivity = (task) => {
  if (task.completedTime) return formatDate(task.createdAt);
  return formatDate(task.createdAt);
};
