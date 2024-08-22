"use client";
import React from "react";
import {
  ChevronDownIcon,
  Cog8ToothIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import { TrashIcon } from "@heroicons/react/24/outline";
import FiltersPolicies from "./filters/FiltersPolicies";
import { useCommon } from "../../../../../../hooks/useCommon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import IconDropdown from "../../../../../../components/SettingsButton";
import useCrmContext from "../../../../../../context/crm";
import ButtonAdd from "../../../control/portafolio/components/ButtonAdd";
import ActiveFiltersDrawer from "@/src/components/ActiveFiltersDrawer";
import usePolicyContext from "@/src/context/policies";

export default function PolicyHeader() {
  const { t } = useTranslation();
  const { trash, settingsReceipts: settings } = useCommon();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { push } = useRouter();
  const { selectedContacts } = useCrmContext();
  const { displayFilters, removeFilter } = usePolicyContext();

  // const handlePathname = () => {
  //   params.delete("page");
  //   params.set("inviteuser", true);
  //   push(`${pathname}?${params.toString()}`);
  // };

  return (
    <header className="flex flex-col">
      <div className="px-4 flex flex-col gap-2  bg-white py-4 rounded-md shadow-sm w-full">
        <div className="flex gap-3 flex-wrap w-full items-center">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900 hidden md:block">
            {t("operations:policies:title")}
          </h1>
          <ButtonAdd />
          <div className="flex-grow">
            <div className="flex border px-1 py-1 bg-gray-300 items-center rounded-md gap-x-2">
              <FiltersPolicies />
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
