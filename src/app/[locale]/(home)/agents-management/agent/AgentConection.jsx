"use client";
import React, { Fragment, useState } from "react";

import { useTranslation } from "react-i18next";
import AgentEditor from "./components/AgentEditor";
import { useRouter } from "next/navigation";
import useConnectionsContext from "@/src/context/connections";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { createAgentRecruitment, updateAgentConnection } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";

export default function AgentRecruitment({ agent, id }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { mutate: mutateAgents } = useConnectionsContext();
  const { mutate } = useSWRConfig();

  const handleFormSubmit = async (data) => {
    const {
      childrens,
      birthdate,
      connectionStartDate,
      connectionEndDate,
      connectionCNSFDate,
      agentConnectionStageId,
      ...other
    } = data;
    let body = {
      ...other,
      children: childrens,
    };
    const connectionData = { agentConnectionStageId };

    if (birthdate) {
      body = {
        ...body,
        birthdate: moment(birthdate).format("YYYY-MM-DD"),
      };
    }
    if (connectionStartDate) {
      connectionData.connectionStartDate =
        moment(connectionStartDate).format("YYYY-MM-DD");
    }
    if (connectionEndDate) {
      connectionData.connectionEndDate =
        moment(connectionEndDate).format("YYYY-MM-DD");
    }
    if (connectionCNSFDate) {
      connectionData.connectionCNSFDate =
        moment(connectionCNSFDate).format("YYYY-MM-DD");
    }
    try {
      setLoading(true);

      if (!agent) {
        body = {
          ...body,
          ...connectionData,
        };
        console.log({ body });
        const response = await createAgentRecruitment(body);
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
        const response = await updateAgentConnection(connectionData, id);
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
        type="conection"
        handleAdd={handleFormSubmit}
      >
        {agent && (
          <div className="pt-6 px-2 md:px-4 lg:px-8 pb-2 md:pb-4 sticky top-0 z-10 bg-gray-200 grid grid-cols-1 gap-2">
            <div className="grid md:grid-cols-2  gap-1">
              <div className="grid md:grid-cols-2  gap-1">
                <p className="text-lg md:text-xl 2xl:text-2xl font-semibold">
                  {agent?.name}
                </p>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-sm">CUA:</p>
                  <p className="text-sm">{agent?.cua ?? "111111111"}</p>
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
                  <p className="uppercase text-sm">Fecha de CONEXIÓN:</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-sm">01/01/0001</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <p className="uppercase text-sm">ETAPA DE AVANCE CONEXIÓN:</p>
                <button className="px-1 py-2 text-sm rounded-md bg-[#64d1ef]">
                  En Avance
                </button>
              </div>
            </div>
          </div>
        )}
      </AgentEditor>
    </Fragment>
  );
}
