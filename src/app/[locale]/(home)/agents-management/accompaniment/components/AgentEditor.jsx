"use client";
import React, { Fragment, useEffect, useRef, useState } from "react";
import AddAgentTabs from "./AddAgentTabs";

import { useTranslation } from "react-i18next";

import { useSearchParams } from "next/navigation";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { clsx } from "clsx";
import General from "./tabs/General";

import { TabGroup, TabPanel, TabPanels } from "@headlessui/react";

export default function AgentEditor({ agent, id }) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [loading, setLoading] = useState(false);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
  const refPrint = useRef();

  const tabs = [
    { name: t("contacts:create:tabs:general"), value: 0, module: "general" },
    {
      name: t("agentsmanagement:accompaniments:agent:recruitment"),
      value: 1,
      module: "recruitment",
      disabled: true,
    },
    {
      name: t("agentsmanagement:accompaniments:agent:training"),
      value: 2,
      module: "training",
      disabled: true,
    },
    {
      name: t("agentsmanagement:accompaniments:agent:conexions"),
      value: 3,
      module: "conexions",
      disabled: true,
    },
    {
      name: t("agentsmanagement:accompaniments:agent:mettings"),
      value: 4,
      module: "mettings",
      disabled: true,
    },
  ];

  useEffect(() => {
    const tabSelected = params.get("tab") ?? "general";
    setSelectedSectionIndex(
      tabs
        .filter((tab) => !tab.hidden)
        .findIndex((tab) => tab.module == tabSelected)
    );
  }, [params.get("tab"), agent]);

  return (
    <Fragment>
      {/* Formulario Principal */}
      {loading && <LoaderSpinner />}

      {/* Encabezado del Formulario */}
      <TabGroup
        selectedIndex={selectedSectionIndex}
        onChange={setSelectedSectionIndex}
        as="div"
        className={clsx(
          "max-h-screen h-full bg-gray-600 relative opacity-100 shadow-xl text-black rounded-tl-[35px] rounded-bl-[35px]  overflow-y-auto lg:overflow-y-hidden",
          {
            "w-full": agent,
            "max-w-xl w-full": !agent,
          }
        )}
      >
        {!agent && (
          <h1 className="text-xl sm:pl-6 pl-2 py-6 px-12 lg:px-[60px]">
            {t("agentsmanagement:accompaniments:agent:create")}
          </h1>
        )}
        {agent && (
          <Fragment>
            <div className="pt-6 px-2 md:px-4 lg:px-8 pb-2 md:pb-4 sticky top-0 z-10 bg-gray-200 grid grid-cols-1 gap-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                <p className="text-lg md:text-xl 2xl:text-2xl font-semibold">
                  {`${agent?.profile?.firstName ?? ""} ${agent?.profile?.lastName ?? ""}`}
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
                    Fecha de ingreso o aprobacion:
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-sm">01/01/0001</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-sm">ETAPA DE AVANCE conexion:</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-1 py-2 text-sm rounded-md bg-[#64d1ef]">
                    En Avance
                  </button>
                </div>
              </div>
            </div>
            <div className="pb-6 px-4 lg:px-8 sticky bg-inherit z-10 top-0">
              <AddAgentTabs tabs={tabs} refPrint={refPrint} contact={agent} />
            </div>
          </Fragment>
        )}

        <TabPanels className="pb-[150px] lg:h-full">
          <TabPanel className="h-full">
            <General id={id} agent={agent} refPrint={refPrint} />
          </TabPanel>
          <TabPanel></TabPanel>
          <TabPanel></TabPanel>
        </TabPanels>
      </TabGroup>
    </Fragment>
  );
}
