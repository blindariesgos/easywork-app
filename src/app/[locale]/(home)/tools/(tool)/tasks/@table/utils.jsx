"use client";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import ModalCrm from "../../../../../../../components/ModalCrm";
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
import { FaChevronCircleDown } from "react-icons/fa";
export const renderCellContent = (
  column,
  task,
  t,
  handleShowSubTasks,
  showSubTasks,
  isSubTask
) => {
  const { row, link } = column;
  const taskValue = task[row];
  switch (row) {
    case "responsible":
      if (!taskValue || taskValue?.length === 0) return "No especificado";
      return (
        <div className="flex gap-x-2 items-center justify-left">
          <Image
            className="h-6 w-6 rounded-full bg-zinc-200"
            width={30}
            height={30}
            src={taskValue[0]?.avatar || "/img/avatar.svg"}
            alt="avatar"
          />
          <div className="font-medium text-black">
            {taskValue[0]?.name ??
              `${taskValue[0]?.profile?.firstName} ${taskValue[0]?.profile?.lastName}`}
          </div>
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
          <div className="font-medium text-black">
            {taskValue?.name ??
              `${taskValue?.profile?.firstName} ${taskValue?.profile?.lastName}`}
          </div>
        </div>
      );
    case "deadline":
      return taskValue ? (
        <div className="flex justify-center">
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
        <div className="flex justify-center">
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

    case "crm":
      return (
        <div className="flex justify-center">
          <ModalCrm conections={task?.crm} />
        </div>
      );

    case "contact":
      if (task?.crm?.length === 0) return "No especificado";
      const contact = task?.crm?.find((item) => item.type == "contact");
      return (
        (contact && (
          <Link
            href={`/sales/crm/contacts/contact/${contact?.crmEntity?.id}?show=true&prev=tasks`}
          >
            <div className="flex gap-x-2 items-center justify-left px-0.5">
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
      const policy = task?.crm?.find((item) => item.type == "poliza");

      return (
        (policy && (
          <Link
            href={`/operations/policies/policy/${policy?.crmEntity?.id}?show=true`}
          >
            <div className="flex gap-x-2 items-center justify-left px-0.5">
              {`${policy?.crmEntity?.company?.name} ${policy?.crmEntity?.poliza} ${policy?.crmEntity?.type?.name}`}
            </div>
          </Link>
        )) ||
        "No especificado"
      );

    case "lead":
      if (task?.crm?.length === 0) return "No especificado";
      const lead = task?.crm?.find((item) => item.type == "lead");
      return (
        (lead && (
          <Link href={`/sales/crm/leads/lead/${lead?.crmEntity?.id}?show=true`}>
            <div className="flex gap-x-2 items-center justify-left px-0.5">
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

    case "name":
      return (
        <div className="flex items-center gap-x-2">
          {handleShowSubTasks && task?.subTasks?.length > 0 && (
            <div
              className="w-5 h-5 cursor-pointer"
              onClick={handleShowSubTasks}
            >
              {!showSubTasks ? (
                <CiCirclePlus className="text-primary w-5 h-5" />
              ) : (
                <CiCircleMinus className="text-primary w-5 h-5" />
              )}
            </div>
          )}
          <Link
            className={clsx("text-black", {
              "pl-8": isSubTask,
              "text-gray-800/45 line-through":
                task.status === "pending_review" || task.isCompleted,
            })}
            href={`/tools/tasks/task/${task.id}?show=true`}
          >
            {taskValue}
          </Link>
        </div>
      );
    default:
      return taskValue;
  }
};

export const getLastActivity = (task) => {
  if (task.completedTime) return formatDate(task.createdAt);
  return formatDate(task.createdAt);
};
