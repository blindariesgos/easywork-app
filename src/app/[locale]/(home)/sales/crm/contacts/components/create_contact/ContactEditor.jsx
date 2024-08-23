"use client";
import React, { Fragment, useEffect, useState } from "react";
import AddContactTabs from "./AddContactTabs";

import { useTranslation } from "react-i18next";

import { useSearchParams } from "next/navigation";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import ContactFolders from "../show_documents/ContactFolders";
import { clsx } from "clsx";
import ContactGeneral from "../show_contact/tab_general/general";

import { TabGroup, TabPanel, TabPanels } from "@headlessui/react";
import PolizasTab from "../show_contact/tab_polizas/PolizasTab";

export default function ContactEditor({ contact, id }) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [loading, setLoading] = useState(false);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);

  useEffect(() => {
    const tabs = [
      "general",
      "policies",
      // "activities",
      // "reports",
      "documents",
    ];
    const tabSelected = params.get("tab") ?? "general";
    setSelectedSectionIndex(tabs.findIndex((tab) => tab == tabSelected));
  }, [params.get("tab")]);

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
          <h1 className="text-xl sm:pl-6 pl-2 py-6 p-2 lg:p-4">
            {t("leads:create:client")}
          </h1>
        )}
        {contact && (
          <div className="bg-transparent py-6 px-4 lg:px-8 ">
            <div className="flex gap-2 items-center">
              <h1 className="text-xl sm:pl-6 pl-2 pb-6">
                {contact
                  ? contact.fullName ?? contact.name
                  : t("leads:create:client")}
              </h1>
            </div>
            <AddContactTabs id={id} />
          </div>
        )}

        <TabPanels className="pb-[150px] h-full ">
          <TabPanel className="h-full">
            <ContactGeneral id={id} contact={contact} />
          </TabPanel>
          <TabPanel>
            <PolizasTab contactID={id} selected="general" />
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
