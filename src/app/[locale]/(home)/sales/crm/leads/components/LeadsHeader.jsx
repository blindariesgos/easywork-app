"use client";
import React from "react";
import { ChevronDownIcon, Cog8ToothIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../../components/form/Button";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useCommon } from "../../../../../../../hooks/useCommon";
import { useRouter, useSearchParams } from "next/navigation";
import IconDropdown from "../../../../../../../components/SettingsButton";
import FiltersLead from "./filters/FiltersLeads";
import ActiveFiltersDrawer from "@/src/components/ActiveFiltersDrawer";
import useLeadContext from "@/src/context/leads";
import LeadsSubMenu from "./LeadsSubMenu";
import useCrmContext from "@/src/context/crm";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

export default function LeadsHeader() {
  const { t } = useTranslation();
  const { trashLead, settingsLead } = useCommon();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { push } = useRouter();
  const { displayFilters, removeFilter } = useLeadContext();
  const { selectedContacts: selectedLeads } = useCrmContext();

  const createOptions = [
    {
      name: "Física",
      onclick: () => push(`/sales/crm/leads/lead?show=true&type=fisica`),
    },
    {
      name: "Moral",
      onclick: () => push(`/sales/crm/leads/lead?show=true&type=moral`),
    },
  ];

  return (
    <header className="flex flex-col">
      <div className="px-2 grid grid-cols-1 gap-2 bg-white py-4 rounded-md shadow-sm">
        <div className="flex gap-3 items-center flex-wrap">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900 hidden md:block">
            {t("leads:header:lead")}
          </h1>
          <Menu>
            <MenuButton className="py-2 px-3 bg-primary hover:bg-easy-500 text-white disabled:opacity-50 shadow-sm text-sm flex items-center gap-x-2 rounded-md  font-medium outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 justify-center">
              {t("leads:header:create")}
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
            <div className="flex border px-1 bg-gray-300 items-center rounded-md gap-x-2 h-[36px]">
              <FiltersLead />
            </div>
          </div>
          {selectedLeads.length > 0 && (
            <IconDropdown
              icon={<TrashIcon className="h-8 w-8 text-primary" />}
              options={trashLead}
              width="w-72"
            />
          )}
          <IconDropdown
            icon={<Cog8ToothIcon className="h-8 w-8 text-primary" />}
            options={settingsLead}
            width="w-[220px]"
            colorIcon="text-green-100"
          />
        </div>
        <ActiveFiltersDrawer
          displayFilters={displayFilters}
          removeFilter={removeFilter}
        />
      </div>
      <div className="flex-none items-center justify-between  border-gray-200 pt-4 hidden lg:flex">
        <LeadsSubMenu />
      </div>
    </header>
  );
}
