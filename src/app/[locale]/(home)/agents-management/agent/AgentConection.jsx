"use client";
import React, { Fragment, useState } from "react";

import { useTranslation } from "react-i18next";
import AgentEditor from "./components/AgentEditor";
import { useRouter } from "next/navigation";
import useConnectionsContext from "@/src/context/connections";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { SlArrowDown } from "react-icons/sl";
import { SlArrowUp } from "react-icons/sl";
import { createAgentConnection, updateAgentConnection } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";
import moment from "moment";
import ConnectionStages from "./components/ConnectionStages";

export default function AgentRecruitment({ agent, id }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { mutate: mutateAgents } = useConnectionsContext();
  const { mutate } = useSWRConfig();
  const [showMore, setShowMore] = useState(false);

  const handleFormSubmit = async (data) => {
    const {
      childrens,
      birthdate,
      connectionStartDate,
      connectionEndDate,
      connectionCnsfDate,
      effectiveDateCua,
      effectiveDateIdcard,
      ...other
    } = data;
    const body = {
      ...other,
      children: childrens,
    };

    if (birthdate) {
      body.birthdate = moment(birthdate).format("YYYY-MM-DD");
    }
    if (connectionStartDate) {
      body.connectionStartDate =
        moment(connectionStartDate).format("YYYY-MM-DD");
    }
    if (connectionEndDate) {
      body.connectionEndDate = moment(connectionEndDate).format("YYYY-MM-DD");
    }
    if (connectionCnsfDate) {
      body.connectionCnsfDate = moment(connectionCnsfDate).format("YYYY-MM-DD");
    }

    if (effectiveDateCua) {
      body.effectiveDateCua = moment(effectiveDateCua).format("YYYY-MM-DD");
    }
    if (effectiveDateIdcard) {
      body.effectiveDateIdcard =
        moment(effectiveDateIdcard).format("YYYY-MM-DD");
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
        const response = await createAgentConnection(info);
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
        const response = await updateAgentConnection(info, id);
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
        type="conection"
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
                      {agent?.connections?.[0]?.startDate
                        ? moment(agent?.connections?.[0]?.startDate).format(
                            "DD/MM/YYYY"
                          )
                        : "N/D"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2">
                      <p className="uppercase text-sm">Fecha de culminaciÓN:</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {agent?.connections?.[0]?.endDate
                        ? moment(agent?.connections?.[0]?.endDate).format(
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
            <ConnectionStages
              stageId={agent?.connections?.[0]?.agentConnectionStage?.id ?? ""}
              agentId={id}
            />
          </div>
        )}
      </AgentEditor>
    </Fragment>
  );
}
