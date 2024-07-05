"use client";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import IconDropdown from "@/src/components/SettingsButton";
import {
  Cog8ToothIcon,
  FireIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import OptionsTask from "../../components/OptionsTask";
import ButtonMore from "../../components/ButtonMore";
import TabsTask from "../../components/Tabs/TabsTask";
import moment from "moment";
import TaskEditor from "../TaskEditor";
import { putTaskCompleted } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { handleApiError } from "@/src/utils/api/errors";
import { useTask } from "@/src/lib/api/hooks/tasks";
import { useTasksConfigs } from "@/src/hooks/useCommon";
import { useSWRConfig } from "swr";
import useAppContext from "@/src/context/app";
import Link from "next/link";
import TaskDelegate from "./components/TaskDelegate";
import TaskTags from "./components/TaskTags";
import TaskParticipants from "./components/TaskParticipants";
import TaskObservers from "./components/TaskObservers";
import TaskResponsible from "./components/TaskResponsible";
import TaskDeadLine from "./components/TaskDeadLine";
import TaskHeaderStatus from "./components/TaskHeaderStatus";
import BannerStatus from "./components/BannerStatus";
import Button from "@/src/components/form/Button";

export default function TaskView({ id }) {
  const { task, isLoading, isError } = useTask(id);
  const { lists } = useAppContext();
  const { t } = useTranslation();
  const { settings } = useTasksConfigs();
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(true);
  const [value, setValueText] = useState(task ? task.description : "");
  const [openEdit, setOpenEdit] = useState(null);
  const { mutate } = useSWRConfig();
  const [isDelegating, setIsDelegating] = useState(false);

  const handleDateChange = (date) => {
    console.log('Nueva fecha:', date);
  };

  const getValues = (name) => {
    // Simulación de obtención de valores (puede ser desde un formulario)
    return console.log(name);
  };

  const setValue = (name, value, options) => {
    // Simulación de establecimiento de valores (puede ser desde un formulario)
    console.log(`Setting ${name} to`, value, options);
  };

  const field = {}; // Pasar props adicionales del campo si es necesario
  const errors = {}; // Pasar errores de validación si es necesario


  const getCompletedTask = async () => {
    try {
      setLoading(true);
      await putTaskCompleted(task.id);
      toast.success(t("tools:tasks:completed-success"));
      setLoading(false);
      await mutate(`/tools/tasks/${task.id}`);
    } catch (error) {
      setLoading(false);
      handleApiError(error.message);
    }
  };

  const getCMRView = (data) => {
    if (data.type === "contact") {
      return (
        <div className="bg-primary hover:bg-indigo-700 p-2 rounded-lg flex justify-between w-52">
          <p className="text-sm text-white">
            {t("tools:tasks:edit:contact")}:
          </p>
          <Link
            href={`/sales/crm/contacts/contact/${data.contact.id}?show=true&prev=task&prev_id=${task.id}`}
            className="text-sm text-white">
            {
              data.contact.fullName
            }
          </Link>
        </div>
      )
    }

    if (data.type === "poliza") {
      return (
        <div className="bg-blue-100 p-2 rounded-lg flex justify-between w-52">
          <p className="text-sm text-white">
            {t("tools:tasks:edit:policy")}:
          </p>
          <p className="text-sm text-white">{data.poliza.noPoliza}</p>
        </div>
      )
    }
  }

  if (isLoading)
    return (
      <div className="flex flex-col h-screen relative w-full overflow-y-auto">
        <div
          className={`flex flex-col flex-1 bg-gray-600 opacity-100 shadow-xl text-black rounded-tl-[35px] rounded-bl-[35px] p-2 sm:p-4 h-full overflow-y-auto`}
        >
          <LoaderSpinner />
        </div>
      </div>
    );

  if (isError) return <>Error al cargar la tarea</>;

  return (
    <div className="flex flex-col h-screen relative w-full overflow-y-auto">
      {loading && <LoaderSpinner />}
      <div
        className={`flex flex-col flex-1 bg-gray-600 opacity-100 shadow-xl text-black rounded-tl-[35px] rounded-bl-[35px] p-2 sm:p-4 h-full overflow-y-auto`}
      >
        {openEdit?.mode !== "copy" && <div className="flex justify-between items-center py-2">
          <h1 className="text-xl font-medium">
            {
              openEdit?.mode === "subtask"
                ? <span>Creando subtarea para: <span className="text-primary italic underline decoration-indigo-600">{task?.name}</span></span>
                : task?.name
            }
          </h1>
          <IconDropdown
            icon={openEdit?.mode === "edit" ? <Cog8ToothIcon className="h-8 w-8 text-primary" aria-hidden="true" /> : null}
            options={settings}
            width="w-44"
          />
        </div>}
        <div className="w-full grid gap-2 sm:gap-4 grid-cols-1 md:grid-cols-12 h-full">
          {openEdit ? (
            <TaskEditor edit={openEdit?.mode === "edit" && task} copy={openEdit?.mode === "copy" && task} subtask={openEdit?.mode === "subtask" && task} />
          ) : (
            <div className={`w-full ${!openEdit ? "col-span-12 md:col-span-7 lg:col-span-8 xl:col-span-9" : "col-span-12"}`}>
              <div className="bg-white rounded-lg">
                <div className="flex justify-between gap-2 items-center bg-gray-300 p-2">
                  <p className="text-xs">
                    {`${t("tools:tasks:task")} - ${t(`tools:tasks:status:${task?.status}`)}`}
                  </p>
                  <div className="flex gap-2 items-center">
                    <FireIcon
                      className={`h-5 w-5 ${check ? "text-red-500" : "text-gray-200"
                        }`}
                    />
                    <p className="text-sm">{t("tools:tasks:new:high")}</p>
                  </div>
                </div>
                <div className="p-2 sm:p-4">
                  <OptionsTask
                    edit={task}
                    setValueText={setValueText}
                    value={value}
                    disabled={task ? true : false}
                  />
                </div>
                {/* CRM */}
                {task?.crm?.length > 0 && (
                  <div className="flex flex-cols items-end flex-col p-2 sm:p-4 gap-2">
                    {
                      task.crm.map(info => {
                        return getCMRView(info)
                      })
                    }
                  </div>
                )}
                <div className="p-2 sm:p-4">
                  <div className="flex gap-2 flex-wrap">
                    {/* TODO: Boton para dar inicio a la logica de cronometrar tarea */}
                    {/* {!task.isCompleted && (
                      <Button
                        label={t("tools:tasks:edit:init")}
                        buttonStyle="green"
                        className="px-3 py-2"
                        fontSize="text-xs"
                      />
                    )} */}
                    {!task.isCompleted && (
                      <button
                        type="button"
                        className="rounded-md disabled:cursor-not-allowed disabled:bg-zinc-200 bg-green-primary hover:bg-green-100 px-3 py-2 text-xs font-medium text-primary shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => getCompletedTask()}
                        disabled={isDelegating}
                      >
                        {t("tools:tasks:edit:end")}
                      </button>

                    )}
                    <ButtonMore
                      setOpenEdit={setOpenEdit}
                      openEdit={openEdit}
                      data={task}
                      setIsDelegating={setIsDelegating}
                    />
                    {isDelegating && (
                      <TaskDelegate lists={lists} setIsDelegating={setIsDelegating} responsibleId={task?.responsible[0]?.id} taskId={task?.id} />
                    )}
                    {/* <div className="flex gap-2 items-center">
                      <BsStopwatchFill className="h-4 w-4 text-easy-400" />
                      <p className="text-easy-400 text-xs">00:00:00</p>
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="mt-2 sm:mt-4 w-full relative">
                <TabsTask data={task} />
              </div>
            </div>
          )}
          {!openEdit && (
            <div className="w-full col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3 bg-white rounded-lg h-full">
              <div className="bg-primary rounded-t-lg p-4 text-center">
                <TaskHeaderStatus task={task} />
              </div>
              <div className="p-2 sm:p-4">
                <TaskDeadLine task={task} onDateChange={handleDateChange} />
                <BannerStatus task={task} />
                <div className="flex justify-between mb-2 border-b-[1px] border-slate-300/40 py-2">
                  <p className="text-sm text-black">
                    {t("tools:tasks:edit:created-the")}
                  </p>
                  <p className="text-sm text-black">
                    {task?.createdAt
                      ? moment(task?.createdAt).format("DD/MM/YYYY")
                      : ""}
                  </p>
                </div>
                <div className="flex justify-between mb-2 border-b-[1px] border-slate-300/40 py-2">
                  <p className="text-sm text-black">
                    {t("tools:tasks:edit:duration")}:
                  </p>
                  <p className="text-sm text-black">00:00:00</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-black border-b-[1px] border-slate-300/40 pt-2 pb-1">
                    {t("tools:tasks:edit:created-by")}
                  </p>
                  <div className="flex gap-2 items-center mt-3">
                    <Image
                      className="h-8 w-8 rounded-full object-contain"
                      width={50}
                      height={50}
                      src={task.createdBy?.avatar || "/img/avatar.svg"}
                      alt=""
                      objectFit="cover"
                    />
                    <p className="font-semibold text-blue-800 text-sm">
                      {task.createdBy?.name || task.createdBy?.username}
                    </p>
                  </div>
                </div>
                <TaskResponsible
                  task={task}
                  lists={lists}
                  field={field}
                />
                <TaskParticipants
                  task={task}
                  lists={lists}
                  field={field}
                />
                <TaskObservers
                  task={task}
                  lists={lists}
                  field={field}
                />
                <TaskTags
                  task={task}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
