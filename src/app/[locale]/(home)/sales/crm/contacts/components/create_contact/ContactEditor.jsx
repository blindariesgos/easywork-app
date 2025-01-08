"use client";
import React, { Fragment, useEffect, useRef, useState } from "react";
import AddContactTabs from "./AddContactTabs";

import { useTranslation } from "react-i18next";

import { useSearchParams } from "next/navigation";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import ContactFolders from "../show_documents/ContactFolders";
import { clsx } from "clsx";
import ContactGeneral from "../show_contact/tab_general/general";

import { TabGroup, TabPanel, TabPanels } from "@headlessui/react";
import ContactRelationsTable from "../../components/show_contact/tab_relations/ContactRelationsTable";
import ContactPolizaTable from "../show_contact/tab_polizas/ContactPolizaTable";

export default function ContactEditor({ contact, id }) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [loading, setLoading] = useState(false);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
  const refPrint = useRef();

  const tabs = [
    { name: t("contacts:create:tabs:general"), value: 0, module: "general" },
    {
      name: contact?.typePerson === "moral" ? "Clientes" : "Compañias",
      value: 1,
      module: "contact",
      hidden: contact?.relations?.length == 0 ?? true,
    },
    {
      name: t("contacts:create:tabs:policies"),
      value: 2,
      module: "policies",
    },
    // { name: t("contacts:create:tabs:activities"), value: 2 },
    // { name: t("contacts:create:tabs:reports"), value: 3 },
    {
      name: t("contacts:create:tabs:documents"),
      value: 3,
      module: "documents",
    },
  ];

  useEffect(() => {
    const tabSelected = params.get("tab") ?? "general";
    setSelectedSectionIndex(
      tabs
        .filter((tab) => !tab.hidden)
        .findIndex((tab) => tab.module == tabSelected)
    );
  }, [params.get("tab"), contact]);

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
            "w-full": contact,
            "max-w-xl w-full": !contact,
          }
        )}
      >
        {!contact && (
          <h1 className="text-xl sm:pl-6 pl-2 py-6 px-12 lg:px-[60px]">
            {t("leads:create:client")}
          </h1>
        )}
        {contact && (
          <div className="py-6 px-4 lg:px-8 sticky bg-inherit z-10 top-0">
            <div className="flex gap-2 items-center">
              <h1 className="text-xl sm:pl-6 pl-2 pb-6 font-semibold">
                {contact
                  ? (contact.fullName ?? contact.name)
                  : t("leads:create:client")}
              </h1>
            </div>
            <AddContactTabs tabs={tabs} refPrint={refPrint} contact={contact} />
          </div>
        )}

        <TabPanels className="pb-[150px] lg:h-full">
          <TabPanel className="h-full">
            <ContactGeneral id={id} contact={contact} refPrint={refPrint} />
          </TabPanel>
          {contact?.relations?.length > 0 && (
            <TabPanel>
              <ContactRelationsTable contact={contact} />
            </TabPanel>
          )}
          <TabPanel className="px-4 lg:px-8">
            <ContactPolizaTable contactId={id} />
          </TabPanel>
          {/* <TabPanel></TabPanel>
          <TabPanel></TabPanel> */}
          <TabPanel>
            <ContactFolders id={id} />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Fragment>
  );
}
