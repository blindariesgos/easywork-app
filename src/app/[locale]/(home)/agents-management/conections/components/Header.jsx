"use client";
import React from "react";
import { Cog8ToothIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import { TrashIcon } from "@heroicons/react/24/outline";
import FilterAccompaniments from "./FilterAccompaniments";
import { useCommon } from "@/src/hooks/useCommon";
import IconDropdown from "@/src/components/SettingsButton";
import useCrmContext from "@/src/context/crm";
import ActiveFiltersDrawer from "@/src/components/ActiveFiltersDrawer";
import useAccompanimentsContext from "@/src/context/accompaniments";

export default function AccompanimentsHeader() {
  const { t } = useTranslation();
  const { trash, settingsReceipts: settings } = useCommon();
  const { selectedContacts } = useCrmContext();
  const { displayFilters, removeFilter } = useAccompanimentsContext();

  return (
    <header className="flex flex-col">
      <div className="px-4 flex flex-col gap-2  bg-white py-4 rounded-md shadow-sm w-full">
        <div className="flex gap-3 flex-wrap w-full items-center">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900 hidden md:block">
            {t("agentsmanagement:conections:title")}
          </h1>
          {/* <Menu>
            <MenuButton className="py-2 px-4 bg-primary hover:bg-easy-500 text-white disabled:opacity-50 shadow-sm text-sm flex items-center gap-x-2 rounded-md  font-medium outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 justify-center">
              Agregar
              <FaChevronDown className="w-4 h-4" />
            </MenuButton>
            <MenuItems
              transition
              anchor="bottom start"
              className="rounded-md mt-2 bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 grid grid-cols-1 gap-2 p-2 "
            >
              {options.map((option, index) => (
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
          </Menu> */}
          <div className="flex-grow">
            <div className="flex border px-1 py-1 bg-gray-300 items-center rounded-md gap-x-2">
              <FilterAccompaniments />
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
            width="w-[180px]"
          />
        </div>
        <ActiveFiltersDrawer
          displayFilters={displayFilters}
          removeFilter={removeFilter}
        />
      </div>
    </header>
  );
}
