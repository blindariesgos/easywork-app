"use client";
import React from "react";
import { Cog8ToothIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import { TrashIcon } from "@heroicons/react/24/outline";
import FilterMettings from "./FilterMettings";
import { useCommon } from "@/src/hooks/useCommon";
import IconDropdown from "@/src/components/SettingsButton";
import useCrmContext from "@/src/context/crm";
import ActiveFiltersDrawer from "@/src/components/ActiveFiltersDrawer";
import useMeetingsContext from "@/src/context/meetings";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa6";
import Button from "@/src/components/form/Button";
export default function MeetingHeader() {
  const { t } = useTranslation();
  const { trash, settingsReceipts: settings } = useCommon();
  const { selectedContacts } = useCrmContext();
  const { displayFilters, removeFilter } = useMeetingsContext();
  return (
    <header className="flex flex-col">
      <div className="px-4 flex flex-col gap-2  bg-white py-4 rounded-md shadow-sm w-full">
        <div className="flex gap-3 flex-wrap w-full items-center">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900 hidden md:block">
            {t("common:menu:agent-management:individual-meetings")}
          </h1>
          <Button className="px-4 py-2" buttonStyle="primary" label="Añadir" />

          <div className="flex-grow">
            <div className="flex border px-1 py-1 bg-gray-300 items-center rounded-md gap-x-2">
              <FilterMettings />
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
