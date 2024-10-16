"use client";
import React, { Fragment, useEffect, useState } from "react";
import Header from "../../../../components/header/Header";
import { ClockIcon, CalendarIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { toast } from "react-toastify";
import { getCookie } from "cookies-next";
import { useTasks } from "../../../../lib/api/hooks/tasks";
import LoaderSpinner, {
  LoadingSpinnerSmall,
} from "@/src/components/LoaderSpinner";
import { formatDate } from "@/src/utils/getFormatDate";
import clsx from "clsx";
const BACKGROUND_IMAGE_URL = "/img/fondo-home.png";
import TaskList from "./components/taskList";
import { addDays } from "date-fns";
import ContactList from "./components/ContactList";
import PolicyList from "./components/PolicyList";

export default function Page() {
  const {
    tasks: overdueTasks,
    isLoading: isLoadingOverdueTasks,
    mutate: mutateOverdueTasks,
  } = useTasks({
    filters: { status: "overdue", isCompleted: false },
  });

  const {
    tasks: deadlineTodayTasks,
    isLoading: isLoadingDeadlineTodayTasks,
    mutate: mutateDeadlineTodayTasks,
  } = useTasks({
    filters: { deadline: formatDate(new Date(), "yyyy-MM-dd") },
  });

  const {
    tasks: nextTasks,
    isLoading: isLoadingNextTasks,
    mutate: mutateNextTasks,
  } = useTasks({
    filters: {
      deadline: [
        formatDate(addDays(new Date(), 1).toDateString(), "yyyy-MM-dd"),
        formatDate(addDays(new Date(), 8).toDateString(), "yyyy-MM-dd"),
      ],
    },
  });

  useEffect(() => {
    const fromUrl = document?.referrer ? new URL(document?.referrer) : null; // Validador para document.referrer
    const urlParams = window.location.search
      ? new URLSearchParams(window.location.search)
      : null; // Validador para window.location.search

    // Verificar si los parámetros son válidos antes de continuar
    if (fromUrl && urlParams) {
      const rememberSessionParam = urlParams.get("rememberSession");
      if (
        fromUrl.pathname === "/auth" &&
        getCookie("rememberSession") === "true" &&
        rememberSessionParam === "true"
      ) {
        toast.success("Datos guardados");
      }
    } else {
      // Manejar el caso en que los parámetros sean nulos o indefinidos (opcional)
      console.warn(
        "No se pudo obtener la URL de referencia o los parámetros de búsqueda."
      );
      // Puedes mostrar un mensaje al usuario, registrar el error, etc.
    }
  }, []);

  let texto =
    "Nathaly Gomez M . Se ha vencido la tarea Seguimiento oportunidad “Naty Polin P-1” “Naty Polin P-2” “Naty Polin P-3” “Naty Polin P-4”";
  let textoRecortado = texto.substring(0, 81);

  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="bg-center bg-cover rounded-2xl"
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})` }}
    >
      {/* Flexbox para controlar el footer */}
      <div className="w-full p-4  h-full grid grid-cols-1 gap-4">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4  gap-4">
          <div
            className={clsx(
              "h-64 bg-white rounded-lg p-2 flex flex-col  items-center gap-2",
              {
                "justify-between": !overdueTasks?.items?.length,
              }
            )}
          >
            <h1 className="font-medium w-full">Actividades vencidas</h1>

            {isLoadingOverdueTasks ? (
              <LoadingSpinnerSmall color="primary" />
            ) : (
              <Fragment>
                {overdueTasks?.items && overdueTasks?.items?.length ? (
                  <TaskList
                    tasks={overdueTasks?.items}
                    mutate={mutateOverdueTasks}
                  />
                ) : (
                  <Fragment>
                    <div className=" flex justify-center">
                      <ClockIcon className="h-16 w-16 text-slate-400" />
                    </div>
                    <div className=" flex justify-center items-center bg-slate-200 shadow-lg text-center rounded-lg w-full h-[60px]">
                      <h1 className="text-sm p-2">
                        ¡Buen trabajo! No tienes actividades vencidas
                      </h1>
                    </div>
                  </Fragment>
                )}
              </Fragment>
            )}
          </div>
          <div
            className={clsx(
              "h-64 bg-white rounded-lg p-2 flex flex-col  items-center gap-2",
              {
                "justify-between": !deadlineTodayTasks?.items?.length,
              }
            )}
          >
            <h1 className="font-medium w-full">Actividades de hoy</h1>
            {isLoadingDeadlineTodayTasks ? (
              <LoadingSpinnerSmall color="primary" />
            ) : (
              <Fragment>
                {deadlineTodayTasks?.items &&
                deadlineTodayTasks?.items?.length ? (
                  <TaskList
                    tasks={deadlineTodayTasks?.items}
                    mutate={mutateDeadlineTodayTasks}
                  />
                ) : (
                  <Fragment>
                    <div className=" flex justify-center">
                      <CalendarIcon className="h-16 w-16 text-slate-400" />
                    </div>
                    <div className=" flex justify-center items-center bg-slate-200 shadow-lg text-center rounded-lg w-full h-[60px]">
                      <h1 className="text-sm p-2 ">
                        No tienes actividades para hoy
                      </h1>
                    </div>
                  </Fragment>
                )}
              </Fragment>
            )}
          </div>
          <div
            className={clsx(
              "h-64 bg-white rounded-lg p-2 flex flex-col  items-center gap-2",
              {
                "justify-between": !nextTasks?.items?.length,
              }
            )}
          >
            <h1 className="font-medium w-full">Actividades próximas</h1>
            {isLoadingNextTasks ? (
              <LoadingSpinnerSmall color="primary" />
            ) : (
              <Fragment>
                {nextTasks?.items && nextTasks?.items?.length ? (
                  <TaskList tasks={nextTasks?.items} mutate={mutateNextTasks} />
                ) : (
                  <Fragment>
                    <div className=" flex justify-center">
                      <CalendarIcon className="h-16 w-16 text-slate-400" />
                    </div>
                    <div className=" flex justify-center items-center bg-slate-200 shadow-lg text-center rounded-lg w-full h-[60px]">
                      <h1 className="text-sm p-2 ">
                        No tienes próximas actividades
                      </h1>
                    </div>
                  </Fragment>
                )}
              </Fragment>
            )}
          </div>
          <PolicyList />
          <div className="col-span-1 md:col-span-2  bg-white rounded-lg p-2 h-72 justify-between flex flex-col">
            <h1 className="h-1/6 font-medium">Recordatorios recientes</h1>
            <Fragment>
              <div className=" flex justify-center items-center bg-slate-200 shadow-lg text-center rounded-lg w-full h-[60px]">
                <h1 className="text-sm p-2 ">
                  En este momento no tienes recordatorios
                </h1>
              </div>
            </Fragment>
          </div>
          <ContactList />
        </div>
      </div>
    </div>
  );
}
