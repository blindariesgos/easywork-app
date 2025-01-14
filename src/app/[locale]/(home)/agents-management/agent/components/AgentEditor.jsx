"use client";
import React, { Fragment, useEffect, useRef, useState } from "react";
import AddAgentTabs from "./AddAgentTabs";

import { useTranslation } from "react-i18next";

import { useSearchParams } from "next/navigation";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { clsx } from "clsx";
import General from "./tabs/General";

import { TabGroup, TabPanel, TabPanels } from "@headlessui/react";

export default function AgentEditor({ agent, id, children, type, handleAdd }) {
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
            "w-[600px]": !agent,
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
            {children}
            <div className="pb-6 px-4 lg:px-8 sticky bg-inherit z-10 top-0">
              <AddAgentTabs
                tabs={tabs}
                refPrint={refPrint}
                agent={agent}
                type={type}
              />
            </div>
          </Fragment>
        )}

        <TabPanels className="pb-[150px] lg:h-full">
          <TabPanel className="h-full">
            <General
              id={id}
              agent={agent}
              refPrint={refPrint}
              type={type}
              handleAdd={handleAdd}
            />
          </TabPanel>
          <TabPanel></TabPanel>
          <TabPanel></TabPanel>
        </TabPanels>
      </TabGroup>
    </Fragment>
  );
}
