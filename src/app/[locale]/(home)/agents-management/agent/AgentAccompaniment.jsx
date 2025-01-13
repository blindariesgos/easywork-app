"use client";
import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import AgentEditor from "./components/AgentEditor";
import moment from "moment";
import { createAgent, updateAgent } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { handleApiError } from "@/src/utils/api/errors";
import useAccompanimentContext from "@/src/context/accompaniments";
import { useSWRConfig } from "swr";

export default function AgentAccompaniment({ agent, id }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { mutate: mutateAgents } = useAccompanimentContext();
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

  const handleFormSubmit = async (data, selectedProfileImage) => {
    const { childrens, birthdate, ...other } = data;
    let body = {
      ...other,
      children: childrens,
      birthdate: moment(birthdate).format("YYYY-MM-DD"),
    };
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
          if (response.errors) {
            message = response.errors.join(", ");
          }
          throw { message };
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
          if (response.errors) {
            message = response.errors.join(", ");
          }
          throw { message };
        }
        toast.success("Agente actualizado correctamente");
        mutate(`/agent-management/agents/${id}`);
        mutateAgents();
      }
      setLoading(false);
      router.back();
    } catch (error) {
      console.log({ error });
      console.error(error.message);
      handleApiError(error.message);
      setLoading(false);
    }
  };

  return (
    <AgentEditor
      agent={agent}
      id={id}
      type="accompaniment"
      handleAdd={handleFormSubmit}
    >
      {agent && (
        <div className="pt-6 px-2 md:px-4 lg:px-8 pb-2 md:pb-4 sticky top-0 z-10 bg-gray-200 grid grid-cols-1 gap-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            <p className="text-lg md:text-xl 2xl:text-2xl font-semibold">
              {agent?.name}
            </p>

            <div className="flex items-center gap-2">
              <p className="uppercase text-sm">CUA:</p>
              <p className="text-sm">{agent?.cua ?? "111111111"}</p>
            </div>
            <div className="flex items-center gap-2">
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
              <p className="uppercase text-sm">Fecha de inicio del proceso:</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="uppercase text-sm">01/01/0001</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="uppercase text-sm">ETAPA DE AVANCE Capacitacion:</p>
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
            </div>
          </div>
        </div>
      )}
    </AgentEditor>
  );
}
