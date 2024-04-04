'use client';
import React from "react";
import { ChevronDownIcon, Cog8ToothIcon, XMarkIcon } from "@heroicons/react/20/solid";
import ContactSubMenu from "./ContactSubMenu";
import { useTranslation } from "react-i18next";
import Button from "@/components/form/Button";
import useAppContext from "@/context/app";
import IconDropdown from "./SettingsButton";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function ContactsHeader() {
  const { t } = useTranslation();
  const { setOpenModal } = useAppContext();

  const settings = [
    {
      value: 0,
      name: t("contacts:header:settings:vcard"),
      onclick: () => {},
    },
    {
      value: 1,
      name: t("contacts:header:settings:gmail"),
      onclick: () => {},
    },
    {
      value: 2,
      name: t("contacts:header:settings:outlook"),
      onclick: () => {},
    },
    {
      value: 3,
      name: t("contacts:header:settings:yahoo"),
      onclick: () => {},
    },
    {
      value: 4,
      name: t("contacts:header:settings:import"),
      onclick: () => {},
    },
    {
      value: 5,
      name: t("contacts:header:settings:crm"),
      onclick: () => {},
    },
    {
      value: 6,
      name: t("contacts:header:settings:csv"),
      onclick: () => {},
    },
    {
      value: 7,
      name: t("contacts:header:settings:excel"),
      onclick: () => {},
    },
    {
      value: 8,
      name: t("contacts:header:settings:export"),
      onclick: () => {},
    },
    {
      value: 9,
      name: t("contacts:header:settings:control"),
      onclick: () => {},
    },
    {
      value: 10,
      name: t("contacts:header:settings:search"),
      onclick: () => {},
    },
    {
      value: 11,
      name: t("contacts:header:settings:entity"),
      onclick: () => {},
    },
  ]

  const trash = [
    {
      value: 0,
      name: t("contacts:header:delete:remove"),
      icon: XMarkIcon,
      onclick: () => {},
    },
    {
      value: 1,
      icon: TrashIcon,
      name: t("contacts:header:delete:trash"),
      onclick: () => {},
    },

  ]

  return (
    <header className="flex flex-col">
      <div className="lg:px-6 px-2 flex gap-3 items-center bg-white py-4 rounded-md">
        <h1 className="text-2xl font-semibold leading-6 text-gray-900 hidden md:block">          
          {t('contacts:header:contact')}
        </h1>
        <Button 
          label={t('contacts:header:create')}
          type="button"
          onclick={() => setOpenModal(true)}
          buttonStyle={"primary"}
          icon={<ChevronDownIcon className="ml-2 h-5 w-5 text-white"/>}
        />
        <div className="flex-grow">
          <label htmlFor="search" className="sr-only">
            {t('contacts:header:search')}
          </label>
          <input
            type="search"
            name="search"
            id="search-cal"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder={t('contacts:header:search')}
          />
        </div>
        
        <IconDropdown 
          icon={<TrashIcon className="h-8 w-8 text-primary" aria-hidden="true"/>}
          options={trash} 
          width="w-72"
        />
        <IconDropdown 
          icon={<Cog8ToothIcon className="h-8 w-8 text-primary" aria-hidden="true"/>}
          options={settings} 
          width="w-[340px]"
        />
      </div>
      <div className="flex-none items-center justify-between  border-gray-200 py-4 hidden lg:flex">
        <ContactSubMenu />
      </div>
    </header>
  );
}
