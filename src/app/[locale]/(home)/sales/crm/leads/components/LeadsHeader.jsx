"use client";
import React from "react";
import { ChevronDownIcon, Cog8ToothIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../../components/form/Button";
import useAppContext from "../../../../../../../context/app";
import { TrashIcon } from "@heroicons/react/24/outline";
import { FaMagnifyingGlass } from "react-icons/fa6";
// import FiltersContact from './filters/FiltersContact';
import { useCommon } from "../../../../../../../hooks/useCommon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import IconDropdown from "../../../../../../../components/SettingsButton";
import FiltersLead from "./filters/FiltersLeads";
import ActiveFiltersDrawer from "@/src/components/ActiveFiltersDrawer";
import useLeadContext from "@/src/context/leads";

export default function LeadsHeader() {
  const { t } = useTranslation();
  const { trashLead, settingsLead } = useCommon();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { push } = useRouter();
  const { displayFilters, removeFilter } = useLeadContext();

  const handlePathname = () => {
    params.delete("page");
    params.set("show", true);
    push(`/sales/crm/leads/lead?${params.toString()}`);
  };

  return (
    <header className="flex flex-col">
      <div className="px-2 grid grid-cols-1 gap-2 bg-white py-4 rounded-md shadow-sm">
        <div className="flex gap-3 items-center flex-wrap">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900 hidden md:block">
            {t("leads:header:lead")}
          </h1>
          <Button
            label={t("leads:header:create")}
            type="button"
            onclick={() => handlePathname()}
            buttonStyle={"primary"}
            icon={<ChevronDownIcon className="ml-2 h-5 w-5 text-white" />}
            className="px-3 py-2"
          />
          <div className="flex-grow">
            <div className="flex border px-1 py-1 bg-gray-300 items-center rounded-md gap-x-2">
              <FiltersLead />
            </div>
          </div>

          <IconDropdown
            icon={
              <TrashIcon className="h-8 w-8 text-primary" aria-hidden="true" />
            }
            options={trashLead}
            width="w-72"
          />
          <IconDropdown
            icon={
              <Cog8ToothIcon
                className="h-8 w-8 text-primary"
                aria-hidden="true"
              />
            }
            options={settingsLead}
            width="w-[340px]"
            colorIcon="text-green-100"
            excel={t("leads:header:excel:export")}
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
