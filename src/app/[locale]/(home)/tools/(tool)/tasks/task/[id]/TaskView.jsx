"use client";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import IconDropdown from "@/src/components/SettingsButton";
import { Cog8ToothIcon, FireIcon, LinkIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import OptionsTask from "../../components/OptionsTask";
import ButtonMore from "../../components/ButtonMore";
import TabsTask from "../../components/Tabs/TabsTask";
import moment from "moment";
import TaskEditor from "../TaskEditor";
import {
  initTaskTracking,
  putTaskCompleted,
  putTaskId,
  stopTaskTracking,
} from "@/src/lib/apis";
import { toast } from "react-toastify";
import { handleApiError, handleFrontError } from "@/src/utils/api/errors";
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
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import SubTaskTable from "./components/SubTaskTable";
import CrmItems from "../../../../../../../../components/CrmItems";
import { useSession } from "next-auth/react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import useTasksContext from "@/src/context/tasks";
import Timer, { calculateElapsedTime } from "@/src/components/Timer";

export default function TaskView({ id, task }) {
  const { lists } = useAppContext();
  const { mutate: mutateTask } = useTasksContext();
  const { t } = useTranslation();
  const session = useSession();
  const { settings } = useTasksConfigs();
  const [loading, setLoading] = useState(false);
  const [taskDescription, setTaskDescription] = useState("");
  const [openEdit, setOpenEdit] = useState(null);
  const { mutate } = useSWRConfig();
  const [isDelegating, setIsDelegating] = useState(false);
  const [plannedTime, setPlannedTime] = useState();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const handleDateChange = (date) => {
    console.log("Nueva fecha:", date);
  };

  const isCreator = useMemo(
    () => task?.createdBy?.id == session.data.user.sub,
    [task, session]
  );

  const canEdit = useMemo(() => {
    if (!task) {
      return true;
    }

    const isResponsible = !!task?.responsible?.find(
      (responsible) => responsible.id == session.data.user.sub
    );

    if (isCreator || isResponsible) return true;

    return false;
  }, [task, session.data.user.sub]);

  const field = {}; // Pasar props adicionales del campo si es necesario

  const getCompletedTask = async () => {
    try {
      setLoading(true);
      const response = await putTaskCompleted(task.id);
      console.log({ response });
      if (response.hasError) {
        handleFrontError(response);
        setLoading(false);
        return;
      }
      toast.success(t("tools:tasks:completed-success"));
      setLoading(false);
      mutateTask();
      mutate(`/tools/tasks/${task?.id}`);
    } catch (error) {
      setLoading(false);
      handleApiError(error.message);
    }
  };

  useEffect(() => {
    if (params.get("action")) {
      setOpenEdit({ mode: params.get("action") });
    }
  }, [params.get("edit")]);

  useEffect(() => {
    if (task) {
      setTaskDescription(task.description);
    }

    if (task?.plannedTime && task?.timeTrackingEnabled) {
      const elapsedTime = calculateElapsedTime(
        task?.plannedTime * 1000,
        moment().format()
      );
      setPlannedTime(
        `/ ${elapsedTime.hours}:${elapsedTime.minutes}:${elapsedTime.seconds}`
      );
    } else {
      setPlannedTime();
    }
  }, [task]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Copiado en el Portapapeles");
  };

  const handleChangeGddStatus = async (status) => {
    const body = {
      metadata: {
        ...task.metadata,
        gddStatus: status,
      },
    };
    setLoading(true);
    try {
      await putTaskId(task.id, body);
      toast.success(t("tools:tasks:update-msg"));
      mutateTask();
      mutate(`/tools/tasks/${task?.id}`);
    } catch (error) {
      handleApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInitTracking = async () => {
    setLoading(true);
    const response = await initTaskTracking(task?.id);
    if (response.hasError) {
      handleFrontError(response);
      setLoading(false);
      return;
    }
    toast.success("Seguimiento de Tarea Iniciado");
    mutate(`/tools/tasks/${task?.id}`);
    setLoading(false);
  };

  const handleStopTracking = async () => {
    setLoading(true);
    const response = await stopTaskTracking(task?.id);
    if (response.hasError) {
      handleFrontError(response);
      setLoading(false);
      return;
    }
    toast.success("Seguimiento de Tarea pausado");
    mutate(`/tools/tasks/${task?.id}`);
    setLoading(false);
  };

  const gddTaskStatus = ["pending", "completed", "not-completed"];

  // console.log("🚀 ~ TaskView ~ task:", task);

  return (
    <div className="flex flex-col h-screen relative w-full overflow-y-auto">
      {loading && <LoaderSpinner />}
      <div
        className={`flex flex-col flex-1 bg-gray-600 opacity-100 shadow-xl text-black rounded-tl-[35px] rounded-bl-[35px] p-2 sm:p-4 h-full overflow-y-auto`}
      >
        {openEdit?.mode !== "copy" && (
          <div className="flex justify-between items-center py-2">
            <div className="flex gap-3 items-center">
              <h1 className="text-xl font-medium">
                {openEdit?.mode === "subtask" ? (
                  <span>
                    Creando subtarea para:{" "}
                    <span className="text-primary italic underline decoration-indigo-600">
                      {task?.name}
                    </span>
                  </span>
                ) : (
                  task?.name
                )}
              </h1>
              {!openEdit && (
                <LinkIcon
                  className="h-4 w-4 text-[#4f4f4f] opacity-50 hover:opacity-100 cursor-pointer"
                  title="Copiar enlace de tarea en Portapapeles"
                  aria-hidden="true"
                  onClick={handleCopyUrl}
                />
              )}
            </div>
            {!openEdit?.mode &&
              task?.metadata?.meet &&
              task?.metadata?.developmentManagerId ===
                session.data.user.sub && (
                <div className="flex gap-2 items-center">
                  <p className="text-xl font-medium">Revisión de GDD</p>
                  <Menu>
                    <MenuButton
                      className={clsx("px-3 py-2 rounded-md", {
                        "bg-[#B5B5B5] text-white":
                          task?.metadata?.gddStatus == "pending" ||
                          !task?.metadata?.gddStatus,
                        "bg-[#A9EA44] text-primary":
                          task?.metadata?.gddStatus == "completed",
                        "bg-[#C30000] text-white":
                          task?.metadata?.gddStatus == "not-completed",
                      })}
                    >
                      {t(
                        `tools:tasks:gdd-status:${task?.metadata?.gddStatus ?? "pending"}`
                      )}
                    </MenuButton>
                    <MenuItems
                      anchor="bottom end"
                      className="mt-1 w-[var(--button-width)] rounded-md bg-white z-50 py-2 shadow-xl"
                    >
                      {gddTaskStatus.map((status) => (
                        <MenuItem
                          key={status}
                          as="div"
                          onClick={() => handleChangeGddStatus(status)}
                          className="data-[focus]:bg-primary data-[focus]:text-white px-2 py-2 text-sm cursor-pointer"
                        >
                          {t(`tools:tasks:gdd-status:${status}`)}
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </div>
              )}
            {openEdit?.mode === "edit" && (
              <IconDropdown
                icon={
                  <Cog8ToothIcon
                    className="h-8 w-8 text-primary"
                    aria-hidden="true"
                  />
                }
                options={settings}
                width="w-44"
              />
            )}
          </div>
        )}
        <div className="w-full grid gap-2 sm:gap-4 grid-cols-1 md:grid-cols-12 h-full max-h-[calc(100vh-50px)] overflow-y-auto pr-2">
          {openEdit ? (
            <TaskEditor
              edit={openEdit?.mode === "edit" && task}
              copy={openEdit?.mode === "copy" && task}
              subtask={openEdit?.mode === "subtask" && task}
            />
          ) : (
            <div
              className={`w-full ${!openEdit ? "col-span-12 grid grid-cols-1 gap-y-2 md:col-span-7 lg:col-span-8 xl:col-span-9" : "col-span-12"}`}
            >
              <div className="bg-white rounded-lg">
                <div className="flex justify-between gap-2 items-center bg-gray-300 p-2 rounded-t-lg">
                  <p className="text-xs">{`${t("tools:tasks:task")} - ${t(`tools:tasks:status:${task?.status}`)}`}</p>
                  <div className="flex gap-2 items-center">
                    <FireIcon
                      className={clsx("h-5 w-5", {
                        "text-red-500": task.important,
                        "text-gray-200": !task.important,
                      })}
                    />
                    <p
                      className={clsx("text-sm", {
                        "text-gray-200": !task.important,
                      })}
                    >
                      {t("tools:tasks:new:high")}
                    </p>
                  </div>
                </div>
                <div className="p-2 sm:p-4">
                  <OptionsTask
                    edit={task}
                    setValueText={setTaskDescription}
                    value={taskDescription}
                    disabled={task ? true : false}
                    canEdit={canEdit}
                  />
                </div>
                {/* CRM */}
                {task?.crm?.length > 0 && (
                  <div className="flex justify-end">
                    <div className="w-full sm:w-2/3 lg:w-1/2 2xl:w-1/3 flex flex-cols items-end flex-col p-2 sm:p-4 gap-2">
                      <CrmItems conections={task.crm} />
                    </div>
                  </div>
                )}

                {task?.metadata &&
                  task?.metadata.data &&
                  task?.metadata.pageId && (
                    <div className="flex justify-end">
                      <div className="w-full sm:w-2/3 lg:w-1/2 2xl:w-1/3 flex flex-cols items-end flex-col p-2 sm:p-4 gap-2">
                        {task.metadata.courseId && (
                          <Link
                            target="_blank"
                            href={`/agents-management/capacitations/e-learning/courses/${task.metadata.courseId}`}
                            className={`bg-[#7169CA] p-2 rounded-lg flex gap-2 justify-between w-full hover:shadow-[-2px_2px_5px_1px_#00000082]`}
                          >
                            <p className="text-sm text-white">
                              Curso: {task.metadata.courseName}
                            </p>
                          </Link>
                        )}
                        {task.metadata.data.evaluations?.length > 0 && (
                          <Link
                            target="_blank"
                            href={`/agents-management/capacitations/e-learning/evaluations/${task.metadata.data.evaluations[0]?.id}`}
                            className={`bg-[#7169CA] p-2 rounded-lg flex gap-2 justify-between w-full hover:shadow-[-2px_2px_5px_1px_#00000082]`}
                          >
                            <p className="text-sm text-white">
                              Evaluación:{" "}
                              {task.metadata.data.evaluations[0]?.name}
                            </p>
                          </Link>
                        )}
                      </div>
                    </div>
                  )}

                {task.parentTask && (
                  <div className="px-2 sm:px-4 py-4">
                    <div className="flex items-center gap-1 py-4 border-t border-b border-gray-500">
                      <p className="text-xs">Tarea pincipal:</p>
                      <Link
                        className="hover:underline text-xs"
                        href={`/tools/tasks/task/${task.id}?show=true`}
                      >
                        {task?.parentTask?.name}
                      </Link>
                    </div>
                  </div>
                )}
                <div className="p-2 sm:p-4">
                  <div className="flex gap-2 flex-wrap items-center">
                    {task.timeTrackingEnabled && (
                      <Timer
                        date={
                          task.currentTrackingStartTime ?? moment().format()
                        }
                        timeSpent={(task?.totalTimeSpent ?? 0) * 1000}
                        paused={!!!task.currentTrackingStartTime}
                      />
                    )}
                    {plannedTime && (
                      <p className="text-easy-400 text-sm">{plannedTime}</p>
                    )}
                    {!task.isCompleted &&
                      task.timeTrackingEnabled &&
                      !task.currentTrackingStartTime && (
                        <Button
                          label={t("tools:tasks:edit:init-time-tracking")}
                          buttonStyle="green"
                          className="px-3 py-2"
                          fontSize="text-xs"
                          onclick={handleInitTracking}
                        />
                      )}
                    {!task.isCompleted && !task.timeTrackingEnabled && (
                      <Button
                        label={t("tools:tasks:edit:init")}
                        buttonStyle="green"
                        className="px-3 py-2"
                        fontSize="text-xs"
                        onclick={() => {}}
                      />
                    )}
                    {!task.isCompleted &&
                      task.timeTrackingEnabled &&
                      task.currentTrackingStartTime && (
                        <Button
                          label={t("tools:tasks:edit:pause-time-tracking")}
                          buttonStyle="green"
                          className="px-3 py-2"
                          fontSize="text-xs"
                          onclick={handleStopTracking}
                        />
                      )}
                    {/* {!task.isCompleted &&
                      !task.timeTrackingEnabled &&
                      task.currentTrackingStartTime && (
                        <Button
                          label={t("tools:tasks:edit:pause")}
                          buttonStyle="green"
                          className="px-3 py-2"
                          fontSize="text-xs"
                          onclick={() => {}}
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
                      canEdit={canEdit}
                      isCreator={isCreator}
                    />
                    {isDelegating && (
                      <TaskDelegate
                        lists={lists}
                        setIsDelegating={setIsDelegating}
                        responsibleId={task?.responsible[0]?.id}
                        taskId={task?.id}
                      />
                    )}
                  </div>
                </div>
              </div>
              {task?.subTasks?.length > 0 && (
                <div className="bg-white rounded-lg p-4 grid grid-cols-1 gap-y-2">
                  <p className="text-sm">SubTareas</p>
                  <SubTaskTable tasks={task?.subTasks} />
                </div>
              )}
              <div className="w-full relative">
                <TabsTask data={task} />
              </div>
            </div>
          )}
          {!openEdit && (
            <div className="w-full col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3 bg-white rounded-lg h-full">
              <div className="bg-primary rounded-t-lg p-4">
                <TaskHeaderStatus task={task} />
              </div>
              <div className="p-2 sm:p-4">
                <TaskDeadLine
                  task={task}
                  onDateChange={handleDateChange}
                  disabled={!canEdit}
                />
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
                  disabled={!canEdit}
                />
                <TaskParticipants
                  task={task}
                  lists={lists}
                  field={field}
                  disabled={!canEdit}
                />
                <TaskObservers
                  task={task}
                  lists={lists}
                  field={field}
                  disabled={!canEdit}
                />
                <TaskTags task={task} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
