"use client";
import React from "react";
import { ClockIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useTasks } from "@/src/lib/api/hooks/tasks";
import { LoadingSpinnerSmall } from "@/src/components/LoaderSpinner";
import clsx from "clsx";
import TaskList from "./components/taskList";
import ContactList from "./components/ContactList";
import PolicyList from "./components/PolicyList";
import Header from "@/src/components/header/Header";
import moment from "moment";

const BACKGROUND_IMAGE_URL = "/img/fondo-home.png";

export default function Page() {
  const utcOffset = moment().utcOffset();
  const taskFilters = {
    overdue: { status: "overdue", isCompleted: false },
    deadlineToday: {
      deadline: [
        moment() // No colocar UTC ya que no coincide con la zona horaria del usuario9ib
          .startOf("day")
          .subtract(utcOffset, "minutes")
          .format("YYYY-MM-DDTHH:mm:ss"),
        moment()
          .endOf("day")
          .subtract(utcOffset, "minutes")
          .format("YYYY-MM-DDTHH:mm:ss"),
      ],
    },
    next: {
      deadline: [
        moment()
          .add(1, "days")
          .startOf("day")
          .subtract(utcOffset, "minutes")
          .format("YYYY-MM-DDTHH:mm:ss"),
        moment()
          .add(16, "days")
          .endOf("day")
          .subtract(utcOffset, "minutes")
          .format("YYYY-MM-DDTHH:mm:ss"),
      ],
    },
  };

  const {
    tasks: overdueTasks,
    isLoading: isLoadingOverdueTasks,
    mutate: mutateOverdueTasks,
  } = useTasks({ filters: taskFilters.overdue });

  const {
    tasks: deadlineTodayTasks,
    isLoading: isLoadingDeadlineTodayTasks,
    mutate: mutateDeadlineTodayTasks,
  } = useTasks({ filters: taskFilters.deadlineToday });

  const {
    tasks: nextTasks,
    isLoading: isLoadingNextTasks,
    mutate: mutateNextTasks,
  } = useTasks({ filters: taskFilters.next });

  const renderTaskSection = ({
    tasks,
    isLoading,
    mutate,
    title,
    icon: Icon,
    emptyMessage,
  }) => (
    <div
      className={clsx(
        "h-64 bg-white rounded-lg p-2 flex flex-col items-center gap-2",
        { "justify-between": !tasks?.items?.length }
      )}
    >
      <h1 className="font-medium w-full">{title}</h1>
      {isLoading ? (
        <LoadingSpinnerSmall color="primary" />
      ) : tasks?.items?.length ? (
        <TaskList tasks={tasks.items} mutate={mutate} />
      ) : (
        <div className="flex flex-col items-center w-full">
          <Icon className="h-16 w-16 text-slate-400" />
          <div className="flex justify-center items-center bg-slate-200 shadow-lg text-center rounded-lg w-full h-[60px]">
            <h1 className="text-sm p-2">{emptyMessage}</h1>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
      {renderTaskSection({
        tasks: overdueTasks,
        isLoading: isLoadingOverdueTasks,
        mutate: mutateOverdueTasks,
        title: "Actividades vencidas",
        icon: ClockIcon,
        emptyMessage: "¡Buen trabajo! No tienes actividades vencidas",
      })}
      {renderTaskSection({
        tasks: deadlineTodayTasks,
        isLoading: isLoadingDeadlineTodayTasks,
        mutate: mutateDeadlineTodayTasks,
        title: "Actividades de hoy",
        icon: CalendarIcon,
        emptyMessage: "No tienes actividades para hoy",
      })}
      {renderTaskSection({
        tasks: nextTasks,
        isLoading: isLoadingNextTasks,
        mutate: mutateNextTasks,
        title: "Actividades próximas",
        icon: CalendarIcon,
        emptyMessage: "No tienes próximas actividades",
      })}
      <PolicyList />
      <div className="col-span-1 md:col-span-2 bg-white rounded-lg p-2 h-72 justify-between flex flex-col">
        <h1 className="h-1/6 font-medium">Recordatorios recientes</h1>
        <div className="flex justify-center items-center bg-slate-200 shadow-lg text-center rounded-lg w-full h-[60px]">
          <h1 className="text-sm p-2">
            En este momento no tienes recordatorios
          </h1>
        </div>
      </div>
      <ContactList />
    </div>
  );
}
