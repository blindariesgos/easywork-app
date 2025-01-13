"use client";
import React, { Fragment, useState } from "react";

import { useTranslation } from "react-i18next";
import AgentEditor from "./components/AgentEditor";
import moment from "moment";
import useRecruitmentsContext from "@/src/context/recruitments";
import { useSWRConfig } from "swr";
import {
  createAgent,
  createAgentRecruitment,
  updateAgent,
  updateAgentRecruitment,
} from "@/src/lib/apis";
import { useRouter } from "next/navigation";
import { handleApiError } from "@/src/utils/api/errors";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { toast } from "react-toastify";

export default function AgentRecruitment({ agent, id }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { mutate: mutateAgents } = useRecruitmentsContext();
  const { mutate } = useSWRConfig();

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

  const handleFormSubmit = async (data) => {
    const {
      childrens,
      birthdate,
      recruitmentStartDate,
      recruitmentEndDate,
      recruitmentEntryDate,
      agentRecruitmentStageId,
      ...other
    } = data;
    let body = {
      ...other,
      children: childrens,
    };
    const recruitmentData = { agentRecruitmentStageId };

    if (birthdate) {
      body = {
        ...body,
        birthdate: moment(birthdate).format("YYYY-MM-DD"),
      };
    }
    if (recruitmentStartDate) {
      recruitmentData.recruitmentStartDate =
        moment(recruitmentStartDate).format("YYYY-MM-DD");
    }
    if (recruitmentEndDate) {
      recruitmentData.recruitmentEndDate =
        moment(recruitmentEndDate).format("YYYY-MM-DD");
    }
    if (recruitmentEntryDate) {
      recruitmentData.recruitmentEntryDate =
        moment(recruitmentEntryDate).format("YYYY-MM-DD");
    }
    try {
      setLoading(true);

      if (!agent) {
        body = {
          ...body,
          ...recruitmentData,
        };
        const formData = getFormData(body);
        const info = Object.keys(body).reduce((acc, key) => {
          return body[key] && body[key].length > 0
            ? {
                ...acc,
                [key]: body[key],
              }
            : acc;
        }, {});
        console.log({ info });

        const response = await createAgentRecruitment(info);
        console.log({ response });
        if (response.hasError) {
          let message = response.message;
          if (Array.isArray(response.message)) {
            message = response.message.join(", ");
          }
          toast.error(message ?? "Ocurrio un error al crear al agente");
          setLoading(false);
          return;
        }
        mutateAgents();
        toast.success("Agente creado exitosamente");
      } else {
        const formData = getFormData(recruitmentData);
        const response = await updateAgentRecruitment(recruitmentData, id);
        console.log({ response });
        if (response.hasError) {
          let message = response.message;
          if (response.errors) {
            message = response.errors.join(", ");
          }
          toast.error(message ?? "Ocurrio un error al crear al agente");
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
        type="recruitment"
        handleAdd={handleFormSubmit}
      >
        {agent && (
          <div className="pt-6 px-2 md:px-4 lg:px-8 pb-2 md:pb-4 sticky top-0 z-10 bg-gray-200 grid grid-cols-1 gap-2">
            <div className="grid md:grid-cols-2  gap-1">
              <div className="grid md:grid-cols-1  gap-1">
                <p className="text-lg md:text-xl 2xl:text-2xl font-semibold">
                  {agent?.name}
                </p>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-sm">CUA:</p>
                  <p className="text-sm">{agent?.cua ?? "111111111"}</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2">
                    <p className="uppercase text-sm">
                      Fecha de inicio del proceso:
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="uppercase text-sm">
                      {moment(agent?.createdAt).format("DD/MM/YYYY")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2">
                    <p className="uppercase text-sm">
                      Fecha de ingreso o APROBACIÓN:
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="uppercase text-sm">01/01/0001</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <p className="uppercase text-sm">
                  ETAPA DE AVANCE DE RECLUTAMENTO:
                </p>
                <button className="px-1 py-2  text-sm rounded-md bg-[#a9ea44]">
                  Ingreso aprobado
                </button>
              </div>
            </div>
          </div>
        )}
      </AgentEditor>
    </Fragment>
  );
}
