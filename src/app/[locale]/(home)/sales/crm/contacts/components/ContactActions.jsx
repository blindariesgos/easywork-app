"use client";
import React, { Fragment, useState } from "react";
import { Cog8ToothIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import IconDropdown from "../../../../../../../components/SettingsButton";
import DuplicateControl from "@/src/components/details/duplicates/contacts/Duplicate";
import Manual from "@/src/components/details/duplicates/contacts/Manual";
import TaskConfigDuplicates from "./TaskConfigDuplicates";
export default function ContactsHeader() {
  const { t } = useTranslation();
  const router = useRouter();
  const [openDuplicateControl, setOpenDuplicateControl] = useState(false);
  const [openTaskConfigDuplicates, setOpenTaskConfigDuplicates] =
    useState(false);
  const [openManualDuplicateControl, setOpenManualDuplicateControl] =
    useState(false);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();

  const settings = [
    {
      value: 0,
      name: t("contacts:header:settings:vcard"),
      onclick: () => {},
      disabled: true,
    },
    {
      value: 1,
      name: t("contacts:header:settings:gmail"),
      onclick: () => {},
      disabled: true,
    },
    {
      value: 2,
      name: t("contacts:header:settings:outlook"),
      onclick: () => {},
      disabled: true,
    },
    {
      value: 3,
      name: t("contacts:header:settings:yahoo"),
      onclick: () => {},
      disabled: true,
    },
    {
      value: 4,
      name: t("contacts:header:settings:import"),
      onClick: () => router.push("/custom-import/contacts"),
      disabled: false,
    },
    {
      value: 5,
      name: t("contacts:header:settings:crm"),
      onclick: () => {},
      disabled: true,
    },
    {
      value: 6,
      name: t("contacts:header:settings:csv"),
      onclick: () => {},
      disabled: true,
    },
    {
      value: 7,
      name: t("contacts:header:settings:excel"),
      onclick: () => {},
      disabled: true,
    },
    {
      value: 8,
      name: t("contacts:header:settings:export"),
      onclick: () => {},
      disabled: true,
    },
    {
      value: 9,
      name: t("contacts:header:settings:control"),
      onClick: () => {
        params.set("show", true);
        router.replace(`${pathname}?${params.toString()}`);
        setOpenDuplicateControl(true);
      },
    },
    {
      value: 10,
      name: t("contacts:header:settings:search"),
      onClick: () => {
        setOpenTaskConfigDuplicates(true);
      },
    },
    {
      value: 11,
      name: t("contacts:header:settings:entity"),
      onclick: () => {},
      disabled: true,
    },
  ];

  return (
    <Fragment>
      <IconDropdown
        icon={
          <Cog8ToothIcon className="h-8 w-8 text-primary" aria-hidden="true" />
        }
        options={settings}
        width="w-[340px]"
      />
      {openDuplicateControl && (
        <DuplicateControl
          onclose={() => setOpenDuplicateControl(false)}
          handleOpenManual={() => setOpenManualDuplicateControl(true)}
        />
      )}
      {openManualDuplicateControl && (
        <Manual onclose={() => setOpenManualDuplicateControl(false)} />
      )}
      <TaskConfigDuplicates
        setIsOpen={setOpenTaskConfigDuplicates}
        isOpen={openTaskConfigDuplicates}
      />
    </Fragment>
  );
}
