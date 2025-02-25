"use client";
import React from "react";
import { ChevronDownIcon, Cog8ToothIcon } from "@heroicons/react/20/solid";
import ContactSubMenu from "./ContactSubMenu";
import { useTranslation } from "react-i18next";
import { TrashIcon } from "@heroicons/react/24/outline";
import FiltersContact from "./filters/FiltersContact";
import { useCommon } from "../../../../../../../hooks/useCommon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import IconDropdown from "../../../../../../../components/SettingsButton";
import useCrmContext from "../../../../../../../context/crm";
import useContactContext from "@/src/context/contacts";
import ActiveFiltersDrawer from "@/src/components/ActiveFiltersDrawer";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

export default function ContactsHeader() {
  const { t } = useTranslation();
  const { trash, settingsContact: settings } = useCommon();
  const { push } = useRouter();
  const { selectedContacts } = useCrmContext();
  const { displayFilters, removeFilter } = useContactContext();

  const createOptions = [
    {
      name: "Física",
      onclick: () => push(`/sales/crm/contacts/contact?show=true&type=fisica`),
    },
    {
      name: "Moral",
      onclick: () => push(`/sales/crm/contacts/contact?show=true&type=moral`),
    },
  ];

  return (
    <header className="flex flex-col">
      <div className="px-4 flex gap-3 flex-col items-center bg-white py-4 rounded-md  shadow-sm">
        <div className="flex gap-3 flex-wrap items-center w-full">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900 ">
            {t("contacts:header:contact")}
          </h1>
          <Menu>
            <MenuButton className="py-2 px-3 bg-primary hover:bg-easy-500 text-white disabled:opacity-50 shadow-sm text-sm flex items-center gap-x-2 rounded-md  font-medium outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 justify-center">
              {t("contacts:header:create")}
              <ChevronDownIcon className="w-4 h-4" />
            </MenuButton>
            <MenuItems
              transition
              anchor="bottom start"
              className="rounded-md mt-2 bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 grid grid-cols-1 gap-2 p-2 "
            >
              {createOptions.map((option, index) => (
                <MenuItem
                  key={index}
                  as="div"
                  onClick={option.onclick && option.onclick}
                  disabled={option.disabled}
                  className="px-2 py-1 hover:[&:not(data-[disabled])]:bg-gray-100 rounded-md text-sm cursor-pointer data-[disabled]:cursor-auto data-[disabled]:text-gray-50"
                >
                  {option.name}
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
          <div className="flex-grow">
            <div className="flex border px-1 bg-gray-300 items-center rounded-md gap-x-2">
              <FiltersContact />
            </div>
          </div>
          {selectedContacts[0]?.id && (
            <IconDropdown
              icon={
                <TrashIcon
                  className="h-8 w-8 text-primary"
                  aria-hidden="true"
                />
              }
              options={trash}
              width="w-72"
            />
          )}

          <IconDropdown
            icon={
              <Cog8ToothIcon
                className="h-8 w-8 text-primary"
                aria-hidden="true"
              />
            }
            options={settings}
            width="w-[340px]"
          />
        </div>
        <ActiveFiltersDrawer
          displayFilters={displayFilters}
          removeFilter={removeFilter}
        />
      </div>
      <div className="flex-none items-center justify-between  border-gray-200 pt-2 hidden lg:flex">
        <ContactSubMenu />
      </div>
    </header>
  );
}
