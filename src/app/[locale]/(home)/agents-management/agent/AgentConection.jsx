"use client";
import React from "react";

import { useTranslation } from "react-i18next";
import AgentEditor from "./components/AgentEditor";

export default function AgentRecruitment({ agent, id }) {
  const { t } = useTranslation();

  return (
    <AgentEditor agent={agent} id={id}>
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
                <p className="uppercase text-sm">
                  Fecha de ingreso o aprobacion:
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="uppercase text-sm">01/01/0001</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="uppercase text-sm">ETAPA DE AVANCE CONEXION:</p>
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
