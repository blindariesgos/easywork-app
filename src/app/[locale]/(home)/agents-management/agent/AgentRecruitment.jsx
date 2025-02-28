"use client";
import React, { Fragment, useState } from "react";

import { useTranslation } from "react-i18next";
import AgentEditor from "./components/AgentEditor";
import moment from "moment";
import useRecruitmentsContext from "@/src/context/recruitments";
import { useSWRConfig } from "swr";
import { SlArrowDown } from "react-icons/sl";
import { SlArrowUp } from "react-icons/sl";
import { createAgentRecruitment, updateAgentRecruitment } from "@/src/lib/apis";
import { useRouter } from "next/navigation";
import { handleApiError } from "@/src/utils/api/errors";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { toast } from "react-toastify";
import RecruitmentStages from "./components/RecruitmentStages";

export default function AgentRecruitment({ agent, id }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { mutate: mutateAgents } = useRecruitmentsContext();
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

  const handleFormSubmit = async (data) => {
    const {
      childrens,
      birthdate,
      recruitmentStartDate,
      recruitmentEndDate,
      recruitmentEntryDate,
      ...other
    } = data;
    const body = {
      ...other,
      children: childrens,
    };

    if (birthdate) {
      body.birthdate = moment(birthdate).format("YYYY-MM-DD");
    }
    if (recruitmentStartDate) {
      body.recruitmentStartDate =
        moment(recruitmentStartDate).format("YYYY-MM-DD");
    }
    if (recruitmentEndDate) {
      body.recruitmentEndDate = moment(recruitmentEndDate).format("YYYY-MM-DD");
    }
    if (recruitmentEntryDate) {
      body.recruitmentEntryDate =
        moment(recruitmentEntryDate).format("YYYY-MM-DD");
    }
    try {
      setLoading(true);
      const info = Object.keys(body).reduce((acc, key) => {
        return body[key] && body[key].length > 0
          ? {
              ...acc,
              [key]: body[key],
            }
          : acc;
      }, {});

      if (!agent) {
        const response = await createAgentRecruitment(info);
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
        const response = await updateAgentRecruitment(info, id);
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
            <div className="flex justify-between items-center gap-1">
              <p className="text-lg md:text-xl 2xl:text-2xl font-semibold">
                {agent?.name}
              </p>
              {showMore && (
                <Fragment>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2">
                      <p className="uppercase text-sm">
                        Fecha de inicio del proceso:
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {agent?.recruitments?.[0]?.startDate
                        ? moment(agent?.recruitments?.[0]?.startDate).format(
                            "DD/MM/YYYY"
                          )
                        : "N/D"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2">
                      <p className="uppercase text-sm">
                        Fecha de ingreso o APROBACIÓN:
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {agent?.recruitments?.[0]?.entryDate
                        ? moment(agent?.recruitments?.[0]?.entryDate).format(
                            "DD/MM/YYYY"
                          )
                        : "N/D"}
                    </div>
                  </div>
                </Fragment>
              )}

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
                  {showMore ? t("common:show-less") : t("common:show-more")}
                </p>
              </div>
            </div>
            <RecruitmentStages
              stageId={
                agent?.recruitments?.[0]?.agentRecruitmentStage?.id ?? ""
              }
              agentId={id}
              agent={agent}
            />
          </div>
        )}
      </AgentEditor>
    </Fragment>
  );
}
