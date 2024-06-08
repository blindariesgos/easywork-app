"use client";
import LoaderSpinner from "../../../../../../../../components/LoaderSpinner";
import IconDropdown from "../../../../../../../../components/SettingsButton";
import {
  Cog8ToothIcon,
  ExclamationTriangleIcon,
  FireIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import OptionsTask from "../../components/OptionsTask";
import Button from "../../../../../../../../components/form/Button";
import ButtonMore from "../../components/ButtonMore";
import { BsStopwatchFill } from "react-icons/bs";
import TabsTaskEdit from "../../components/Tabs/TabsTaskEdit";
import moment from "moment";
import TaskCreate from "../TaskCreate";
import { putTaskCompleted } from "../../../../../../../../lib/apis";
import { toast } from "react-toastify";
import { handleApiError } from "../../../../../../../../utils/api/errors";
import { useTask } from "@/src/lib/api/hooks/tasks";
import { useTasksConfigs } from "@/src/hooks/useCommon";
export default function TaskEdit({ id }) {
  const { task, isLoading, isError } = useTask(id);

  console.log(task);

  const { t } = useTranslation();
  const { settings } = useTasksConfigs();
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(true);
  const [value, setValueText] = useState(task ? task.description : "");
  const [openEdit, setOpenEdit] = useState(false);

  const getCompletedTask = async () => {
    try {
      setLoading(true);
      await putTaskCompleted(task.id);
      toast.success(t("tools:tasks:completed-success"));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleApiError(error.message);
    }
  };

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
        <div className="flex justify-between items-center py-2">
          <h1 className="text-xl font-medium">{task?.name}</h1>
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
        </div>
        <div className="w-full flex gap-2 sm:gap-4 sm:flex-row flex-col h-full">
          {openEdit ? (
            <TaskCreate edit={task} />
          ) : (
            <div className={`w-full ${!openEdit ? "sm:w-9/12" : "sm:w-full"}`}>
              <div className="bg-white rounded-lg">
                <div className="flex justify-between gap-2 items-center bg-gray-300 p-2">
                  <p className="text-xs">
                    {t("tools:tasks:task")} -{" "}
                    {t(`tools:tasks:status:${task?.status}`)}
                  </p>
                  <div className="flex gap-2 items-center">
                    <FireIcon
                      className={`h-5 w-5 ${
                        check ? "text-red-500" : "text-gray-200"
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
                {/* <div className="flex items-end flex-col p-2 sm:p-4 gap-2">
                  <div className="bg-blue-100 p-2 rounded-lg flex justify-between w-52">
                    <p className="text-sm text-white">
                      {t("tools:tasks:edit:contact")}:
                    </p>
                    <p className="text-sm text-white">Armando Medina</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-lg flex justify-between w-52">
                    <p className="text-sm text-white">
                      {t("tools:tasks:edit:policy")}:
                    </p>
                    <p className="text-sm text-white">1587456621</p>
                  </div>
                </div> */}
                <div className="p-2 sm:p-4">
                  <div className="flex gap-2 flex-wrap">
                    {!task.isCompleted && (
                      <Button
                        label={t("tools:tasks:edit:init")}
                        buttonStyle="green"
                        className="px-3 py-2"
                        fontSize="text-xs"
                      />
                    )}
                    {!task.isCompleted && (
                      <Button
                        label={t("tools:tasks:edit:end")}
                        buttonStyle="green"
                        className="px-3 py-2"
                        fontSize="text-xs"
                        onclick={() => getCompletedTask()}
                      />
                    )}
                    <ButtonMore
                      setOpenEdit={setOpenEdit}
                      openEdit={openEdit}
                      data={task}
                    />
                    <div className="flex gap-2 items-center">
                      <BsStopwatchFill className="h-4 w-4 text-easy-400" />
                      <p className="text-easy-400 text-xs">00:00:00</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2 sm:mt-4 w-full relative">
                <TabsTaskEdit data={task} />
              </div>
            </div>
          )}
          {!openEdit && (
            <div className="w-full sm:w-3/12 bg-white rounded-lg h-full">
              <div className="bg-primary rounded-t-lg p-4 text-center">
                <p className="text-white font-medium text-sm">
                  {t("tools:tasks:edit:pending-since", {
                    date: moment(task?.createdAt).format("DD-MM-YYYY"),
                  })}
                </p>
              </div>
              <div className="p-2 sm:p-4">
                <div className="flex justify-between mb-2 border-b-[1px] border-slate-300/40 py-2">
                  <p className="text-sm text-black">
                    {t("tools:tasks:edit:limit-date")}:
                  </p>
                  <p className="text-sm text-black">
                    {task?.deadline
                      ? moment(task?.deadline).format("DD/MM/YYYY")
                      : ""}
                  </p>
                </div>
                {task.status !== "pending" && (
                  <div className="w-ful bg-easy-300 rounded-md flex justify-center gap-2 p-1 my-3">
                    <ExclamationTriangleIcon className="h-6 w-6 text-primary" />
                    <p>{t("tools:tasks:edit:task-overdue")}</p>
                  </div>
                )}
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
                      className="h-10 w-10 rounded-full object-contain"
                      width={50}
                      height={50}
                      src={task.createdBy?.avatar || "/img/avatar.svg"}
                      alt=""
                      objectFit="cover"
                    />
                    <p className="text-base font-semibold text-black">
                      {task.createdBy?.name || task.createdBy?.username}
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <div>
                    <p className="text-sm text-black border-b-[1px] border-slate-300/40 pt-2 pb-1">
                      {t("tools:tasks:edit:responsible")}
                    </p>
                  </div>
                  {/* <div className="cursor-pointer">
											<p className="text-xs text-black">{t('tools:tasks:edit:change')}</p>
										</div> */}
                  {task?.responsible.length > 0 &&
                    task.responsible.map((resp, index) => (
                      <div className="flex gap-2 items-center mt-3" key={index}>
                        <Image
                          className="h-10 w-10 rounded-full object-cover"
                          width={50}
                          height={50}
                          src={resp?.avatar || "/img/avatar.svg"}
                          alt=""
                          objectFit="cover"
                        />
                        <p className="text-base font-semibold text-black">
                          {resp?.name || resp?.username}
                        </p>
                      </div>
                    ))}
                </div>
                <div className="mb-4">
                  <p className="text-sm text-black border-b-[1px] border-slate-300/40 pt-2 pb-1">
                    {t("tools:tasks:edit:participant")}
                  </p>
                  {task?.participants.length > 0 &&
                    task.participants.map((part, index) => (
                      <div className="flex gap-2 items-center mt-3" key={index}>
                        <Image
                          className="h-10 w-10 rounded-full object-fill"
                          width={400}
                          height={400}
                          src={part?.avatar || "/img/avatar.svg"}
                          alt=""
                          objectFit="cover"
                        />
                        <p className="text-base font-semibold text-black">
                          {part?.username}
                        </p>
                      </div>
                    ))}
                </div>
                <div className="mb-4">
                  <div className="flex justify-between border-b-[1px] border-slate-300/40 pt-2 pb-1">
                    <p className="text-sm text-black">
                      {t("tools:tasks:edit:observers")}
                    </p>
                    <p className="text-xs text-slate-400 cursor-pointer hover:text-slate-500">
                      Agregar
                    </p>
                  </div>
                  {task?.observers.length > 0 &&
                    task.observers.map((obs, index) => (
                      <div className="flex gap-2 items-center mt-3" key={index}>
                        <Image
                          className="h-10 w-10 rounded-full object-cover"
                          width={50}
                          height={50}
                          src={obs?.avatar || "/img/avatar.svg"}
                          alt=""
                          objectFit="contain"
                        />
                        <p className="text-base font-semibold text-black">
                          {obs?.name}
                        </p>
                      </div>
                    ))}
                </div>
                <div className="mb-4">
                  <p className="text-sm text-black border-b-[1px] border-slate-300/40 pt-2 pb-1">
                    {t("tools:tasks:edit:tags")}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {task.tags.length > 0 &&
                      task.tags.map((tag, index) => (
                        <div
                          key={index}
                          className="px-2 py-1 rounded-md bg-gray-200"
                        >
                          <p className="text-sm">#{tag.name}</p>
                        </div>
                      ))}
                  </div>
                  {/* <div className="mt-2 flex gap-2 items-center cursor-pointer">
										<PlusIcon className="h-3 w-3" />
										<p className="text-xs text-black">{t('tools:tasks:edit:addTag')}</p>
									</div> */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
