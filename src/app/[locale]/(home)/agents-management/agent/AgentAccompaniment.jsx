"use client";
import React, { Fragment, useState } from "react";

import { useTranslation } from "react-i18next";
import AgentEditor from "./components/AgentEditor";
import moment from "moment";
import { createAgent, updateAgent } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { handleApiError } from "@/src/utils/api/errors";
import useAccompanimentContext from "@/src/context/accompaniments";
import { useSWRConfig } from "swr";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { SlArrowDown } from "react-icons/sl";
import { SlArrowUp } from "react-icons/sl";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import clsx from "clsx";
import { connectionsStage } from "@/src/utils/constants";

import { recruitmentStages } from "@/src/utils/constants";
export default function AgentAccompaniment({ agent, id }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { mutate: mutateAgents } = useAccompanimentContext();
  const { mutate } = useSWRConfig();
  const [showMore, setShowMore] = useState(false);

  const getFormData = (body) => {
    const formData = new FormData();
    for (const key in body) {
      if (body[key] === null || body[key] === undefined || body[key] === "") {
        continue;
      }
      if (body[key] instanceof File || body[key] instanceof Blob) {
        formData.append(key, body[key]);
      } else if (Array.isArray(body[key])) {
        formData.append(key, JSON.stringify(body[key]));
      } else {
        formData.append(key, body[key]?.toString() || "");
      }
    }
    return formData;
  };

  const handleFormSubmit = async (data, selectedProfileImage) => {
    const { childrens, birthdate, ...other } = data;
    let body = {
      ...other,
      children: childrens,
    };
    if (birthdate) {
      body = {
        ...body,
        birthdate: moment(birthdate).format("YYYY-MM-DD"),
      };
    }
    try {
      setLoading(true);
      if (!agent) {
        if (selectedProfileImage?.file) {
          body = {
            ...body,
            avatar: selectedProfileImage?.file || "",
          };
        }
        const formData = getFormData(body);

        const response = await createAgent(formData);
        if (response.hasError) {
          let message = response.message;
          if (Array.isArray(response.message)) {
            message = response.message.join(", ");
          }
          toast.error(message);
          setLoading(false);
          return;
        }
        mutateAgents();
        toast.success("Agente creado exitosamente");
      } else {
        if (selectedProfileImage?.file) {
          body = {
            ...body,
            image: selectedProfileImage?.file || "",
          };
        }
        const formData = getFormData(body);
        const response = await updateAgent(formData, id);
        if (response.hasError) {
          let message = response.message;
          if (Array.isArray(response.message)) {
            message = response.message.join(", ");
          }
          toast.error(message);
          setLoading(false);
          return;
        }
        toast.success("Agente actualizado correctamente");
        mutate(`/agent-management/agents/${id}`);
        mutateAgents();
      }
      setLoading(false);
      router.back();
    } catch (error) {
      console.error(error.message);
      handleApiError(error.message);
      setLoading(false);
    }
  };

  return (
    <Fragment>
      {loading && <LoaderSpinner />}
      <AgentEditor
        agent={agent}
        id={id}
        type="accompaniment"
        handleAdd={handleFormSubmit}
      >
        {agent && (
          <div className="pt-6 px-2 md:px-4 lg:px-8 pb-2 md:pb-4 sticky top-0 z-10 bg-gray-200 grid grid-cols-1 gap-2">
            <div className="flex justify-between gap-1">
              <p className="text-lg md:text-xl 2xl:text-2xl font-semibold">
                {agent?.name}
              </p>
              <div className="grid gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2 min-w-[260px]">
                    <p className="uppercase text-sm">estado del agente:</p>
                  </div>
                  <div className="flex justify-between min-w-[260px]">
                    <div
                      className={clsx(
                        "py-2 px-3 rounded-lg capitalize text-sm cursor-pointer",
                        {
                          "bg-[#A9EA44]": agent?.isActive,
                          "bg-[#FF2424]": !agent?.isActive,
                        }
                      )}
                    >
                      {agent?.isActive ? "Activo" : "Inactivo"}
                    </div>
                    <div
                      className="flex items-center justify-end gap-1 cursor-pointer"
                      onClick={() => setShowMore(!showMore)}
                    >
                      {showMore ? (
                        <SlArrowUp className="w-3 h-3" />
                      ) : (
                        <SlArrowDown className="w-3 h-3" />
                      )}
                      <p className="text-sm">
                        {showMore
                          ? t("common:show-less")
                          : t("common:show-more")}
                      </p>
                    </div>
                  </div>
                </div>
                {agent?.recruitments?.length > 0 && showMore && (
                  <div className="flex items-center">
                    <p className="uppercase text-sm min-w-[260px]">
                      Etapa de avance de Reclutamiento:
                    </p>
                    <div
                      className={clsx(
                        "py-2 px-3 rounded-lg capitalize text-sm"
                      )}
                      style={{
                        background: recruitmentStages.find(
                          (x) =>
                            x.id ==
                            agent?.recruitments[0]?.agentRecruitmentStage?.id
                        )?.color,
                      }}
                    >
                      {agent?.recruitments[0]?.agentRecruitmentStage?.name}
                    </div>
                  </div>
                )}
                {agent?.connections?.length > 0 && showMore && (
                  <div className="flex items-center">
                    <p className="uppercase text-sm min-w-[260px]">
                      Etapa de avance de Conexión:
                    </p>
                    <div className="flex justify-between min-w-[260px]">
                      <div
                        className={clsx(
                          "py-2 px-3 rounded-lg capitalize text-sm"
                        )}
                        style={{
                          background: connectionsStage.find(
                            (x) =>
                              x.id ==
                              agent?.connections[0]?.agentConnectionStageId
                          )?.color,
                        }}
                      >
                        {agent?.connections[0]?.agentConnectionStage?.name}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* <div className="flex items-center gap-2">
                <p className="uppercase text-sm">
                  ETAPA DE AVANCE DE RECLUTAMENTO:
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-1 py-2  text-sm rounded-md bg-[#a9ea44]">
                  Ingreso aprobado
                </button>
              </div>
              <div className="flex items-center gap-2">
                <p className="uppercase text-sm">
                  Fecha de inicio del proceso:
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="uppercase text-sm">01/01/0001</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="uppercase text-sm">
                  ETAPA DE AVANCE Capacitacion:
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-1 py-2  text-sm rounded-md bg-[#ffeb04]">
                  50%
                </button>
              </div>
              <div className="flex items-center gap-2">
                <p className="uppercase text-sm">
                  Fecha de ingreso o APROBACIÓN:
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="uppercase text-sm">01/01/0001</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="uppercase text-sm">ETAPA DE AVANCE conexiÓn:</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-1 py-2 text-sm rounded-md bg-[#64d1ef]">
                  En Avance
                </button>
              </div> */}
            </div>
          </div>
        )}
      </AgentEditor>
    </Fragment>
  );
}
