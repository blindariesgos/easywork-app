"use client";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import OptionsTask from "./components/OptionsTask";
import TabsMeet from "./components/Tabs/TabsMeet";
import { useRouter, useSearchParams } from "next/navigation";
import CrmItems from "@/src/components/CrmItems";
import Button from "@/src/components/form/Button";
import moment from "moment";
import { toast } from "react-toastify";
import { getAllTasks } from "@/src/lib/apis";
import AssignmentsTable from "./components/AssignmentsTable";

export default function MeetView({ meet, id }) {
  const [loading, setLoading] = useState(false);
  const [taskDescription, setTaskDescription] = useState("");
  const { t } = useTranslation();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (meet) {
      setTaskDescription(meet.description);
    }
  }, [meet]);

  const getTasks = async () => {
    const response = await getAllTasks({
      config: {
        limit: 20,
        page: 1,
      },
      filters: {
        meetId: meet.id,
      },
    });
    if (response?.items?.length) {
      setTasks(response?.items);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const handleCreateMeetTask = () => {
    if (!meet.agents[0]?.user?.id && meet?.type == "individual") {
      toast.error("El agente no posee usuario en el sistema");
      return;
    }
    const agentId = meet?.agents[0]?.id ?? "group";
    localStorage.setItem(
      agentId,
      JSON.stringify({
        meet: id,
        developmentManagerId: meet?.developmentManager?.id,
        userId: meet?.agents[0]?.user?.id,
      })
    );
    router.push(
      `/tools/tasks/task?prev=meet-${meet?.type}&prev_id=${agentId}&show=true`
    );
  };

  return (
    <div className="flex flex-col h-screen relative w-full overflow-y-auto">
      {loading && <LoaderSpinner />}
      <div
        className={`flex flex-col flex-1 bg-gray-600 opacity-100 shadow-xl text-black rounded-tl-[35px] rounded-bl-[35px] p-2 sm:p-4 h-full overflow-y-auto`}
      >
        <div className="flex justify-between items-center py-2">
          <div className="flex flex-col gap-3">
            <h1 className="text-xl">
              {t(`agentsmanagement:meetings-and-sessions:${meet?.type}:title`)}
            </h1>
          </div>
        </div>
        <div className="w-full grid gap-2 sm:gap-4 grid-cols-1 md:grid-cols-12 h-full max-h-[calc(100vh-50px)] overflow-y-auto pr-2">
          <div
            className={`w-full col-span-12 grid grid-cols-1 gap-y-2 md:col-span-7 lg:col-span-8 xl:col-span-9`}
          >
            <div className="bg-white rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex justify-between gap-2 items-center bg-gray-300 p-2 rounded-t-lg">
                  <h1 className="text-lg font-medium">{meet?.title}</h1>
                  <Button
                    label={"Editar"}
                    buttonStyle="text"
                    className={"text-primary"}
                    onclick={() =>
                      router.push(
                        `/agents-management/meetings-and-sessions/${meet?.type == "group" ? "teams" : "individuals"}/meet/${id}/edit?show=true`
                      )
                    }
                  />
                </div>
                <div className="p-2 sm:p-4">
                  <OptionsTask
                    edit={meet}
                    setValueText={setTaskDescription}
                    value={taskDescription}
                    disabled={meet ? true : false}
                  />
                </div>
                {/* CRM */}
                {meet?.crm?.length > 0 && (
                  <div className="flex justify-end">
                    <div className="w-full sm:w-2/3 lg:w-1/2 2xl:w-1/3 flex flex-cols items-end flex-col p-2 sm:p-4 gap-2">
                      <CrmItems conections={meet.crm} />
                    </div>
                  </div>
                )}
              </div>
              {meet?.developmentManager && meet?.agents?.length > 0 && (
                <div className="p-2 sm:p-4">
                  <Button
                    buttonStyle="primary"
                    label="Agregar tarea"
                    className="px-3 py-2"
                    onclick={handleCreateMeetTask}
                  />
                </div>
              )}
              {tasks.length > 0 && (
                <div className="grid grid-cols-1 gap-2 p-2 sm:p-4">
                  <p className="font-semibold">Tareas relacionadas</p>
                  <AssignmentsTable
                    tasks={tasks}
                    isLoading={false}
                    className="pl-0"
                  />
                </div>
              )}
            </div>
            <div className="w-full relative">
              <TabsMeet data={meet} />
            </div>
          </div>
          <div className="w-full col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3 flex flex-col gap-2">
            <div className="rounded-lg bg-white p-4">
              <p className=" font-semibold">
                {t(`agentsmanagement:meetings-and-sessions:gdd`)}
              </p>
              <hr />
              <div className="flex gap-x-2 items-center justify-left py-2">
                <Image
                  className="h-10 w-10 rounded-full bg-zinc-200"
                  width={40}
                  height={40}
                  src={meet?.developmentManager?.avatar || "/img/avatar.svg"}
                  alt="avatar"
                />
                <div className=" text-[#0F8BBF] font-semibold underline">
                  {meet?.developmentManager?.name ?? "No asignado"}
                </div>
              </div>
              <div>
                <div className="flex gap-2">
                  <p className="text-sm font-semibold">
                    {t(`agentsmanagement:meetings-and-sessions:date`)}:
                  </p>
                  <p className="text-sm">
                    {meet.startTime
                      ? moment(meet.startTime).format("DD/MM/YYYY hh:mm a")
                      : "No disponible"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <p className="text-sm font-semibold">
                    {t(`agentsmanagement:meetings-and-sessions:time`)}:
                  </p>
                  <p className="text-sm">{meet?.duration ?? "No disponible"}</p>
                </div>
                <div className="flex gap-2">
                  <p className="text-sm font-semibold">
                    {t(`agentsmanagement:meetings-and-sessions:state:title`)}:
                  </p>
                  <p className="text-sm">
                    {t(
                      `agentsmanagement:meetings-and-sessions:state:${
                        meet.status
                      }`
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4">
              <p className=" font-semibold">
                {t(`agentsmanagement:meetings-and-sessions:${meet.type}:agent`)}
              </p>
              <hr />
              <div className="py-2">
                {meet?.agents && meet?.agents?.length ? (
                  meet?.agents?.map((agent) => (
                    <div
                      className="flex gap-x-2 items-center justify-left py-2"
                      key={agent.id}
                    >
                      <Image
                        className="h-10 w-10 rounded-full bg-zinc-200"
                        width={40}
                        height={40}
                        src={agent?.avatar || "/img/avatar.svg"}
                        alt="avatar"
                      />
                      <div className=" text-[#0F8BBF] font-semibold underline">
                        {agent?.name ?? "No asignado"}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No Asignado</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
