import { LoadingSpinnerSmall } from "@/src/components/LoaderSpinner";
import { getAllTasks } from "@/src/lib/apis";
import clsx from "clsx";
import { is } from "date-fns/locale";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import {
  formatDate,
  getTaskOverdueTimeDelta,
  isDateOverdue,
  isDateTomorrowOverdue,
  isDateTodayOverdue,
  isDateMoreFiveDayOverdue,
  isDateMoreTenDayOverdue,
} from "@/src/utils/getFormatDate";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const AssignmentsTable = ({ tasks, isLoading, className }) => {
  const { t } = useTranslation();
  const status = {
    pending: "Pendiente",
    completed: "Hecho",
    "not-completed": "No realizado",
  };

  if (isLoading) return <LoadingSpinnerSmall />;
  if (tasks.length == 0) return "No tiene asignaciones";

  return (
    <div className={`grid grid-cols-1 ${className}`}>
      <div className="grid grid-cols-4 rounded-xl gap-y-1 text-xs">
        <p className="p-2 bg-white rounded-s-xl">Nombre</p>
        <p className="p-2 bg-white">Fecha limite</p>
        <p className="p-2 bg-white">Creado por</p>
        <p className="p-2 bg-white rounded-e-xl">Responsable</p>
        {tasks.map((task) => (
          <Fragment key={task.id}>
            <div className="bg-[#f3f1f5] py-1 px-2 rounded-s-xl">
              <Link
                className={clsx("text-black hover:underline", {
                  "text-gray-800/45 line-through":
                    task.status === "pending_review" || task.isCompleted,
                })}
                href={`/tools/tasks/task/${task.id}?show=true`}
              >
                {task.name}
              </Link>
            </div>
            <div className="bg-[#f3f1f5] py-1 px-2">
              {task?.deadline ? (
                <div className="flex justify-center">
                  <span
                    className={clsx("p-1 px-2 rounded-full text-sm w-auto", {
                      "bg-red-200 text-red-900":
                        isDateOverdue(task?.deadline) && !task.completedTime,
                      "bg-green-200 text-green-900":
                        isDateTomorrowOverdue(task?.deadline) &&
                        !task.completedTime,
                      "bg-orange-300 text-orange-900":
                        isDateTodayOverdue(task?.deadline) &&
                        !task.completedTime,
                      "bg-blue-300 text-blue-900":
                        isDateMoreFiveDayOverdue(task?.deadline) &&
                        !task.completedTime,
                      "text-gray-800/45 line-through": task.isCompleted,
                      "bg-gray-300":
                        !task?.deadline ||
                        (isDateMoreTenDayOverdue(task?.deadline) &&
                          !task.completedTime),
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
              )}
            </div>
            <div className="bg-[#f3f1f5] py-1 px-2">
              <div className="flex gap-x-2 items-center justify-left">
                <Image
                  className="h-6 w-6 rounded-full bg-zinc-200"
                  width={30}
                  height={30}
                  src={task?.createdBy?.avatar || "/img/avatar.svg"}
                  alt="avatar"
                />
                <div className="font-medium text-black">
                  {task?.createdBy?.name ??
                    `${task?.createdBy?.profile?.firstName} ${task?.createdBy?.profile?.lastName}`}
                </div>
              </div>
            </div>
            <div className="bg-[#f3f1f5] py-1 px-2 rounded-e-xl">
              <div className="flex gap-x-2 items-center justify-left">
                <Image
                  className="h-6 w-6 rounded-full bg-zinc-200"
                  width={30}
                  height={30}
                  src={task?.responsible?.[0]?.avatar || "/img/avatar.svg"}
                  alt="avatar"
                />
                <div className="font-medium text-black">
                  {task?.responsible?.[0]?.name ??
                    `${task?.responsible?.[0]?.profile?.firstName} ${task?.responsible?.[0]?.profile?.lastName}`}
                </div>
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default AssignmentsTable;
