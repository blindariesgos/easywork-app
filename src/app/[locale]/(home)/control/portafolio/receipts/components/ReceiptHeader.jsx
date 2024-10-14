"use client";
import React from "react";
import {
  ChevronDownIcon,
  Cog8ToothIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../../components/form/Button";
import useAppContext from "../../../../../../../context/app";
import { TrashIcon } from "@heroicons/react/24/outline";
import FiltersReceipt from "./filters/FiltersReceipt";
import { useCommon } from "../../../../../../../hooks/useCommon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import IconDropdown from "../../../../../../../components/SettingsButton";
import useCrmContext from "../../../../../../../context/crm";
import ButtonAdd from "../../components/ButtonAdd";
import ActiveFiltersDrawer from "@/src/components/ActiveFiltersDrawer";
import useReceiptContext from "@/src/context/receipts";

export default function ReceiptHeader() {
  const { t } = useTranslation();
  const { trash, settingsReceipts: settings } = useCommon();
  const { selectedContacts } = useCrmContext();
  const { displayFilters, removeFilter } = useReceiptContext();
  return (
    <header className="flex flex-col">
      <div className="px-4 flex gap-2 flex-col bg-white py-4 rounded-md  shadow-sm">
        <div className="flex gap-3 items-center flex-wrap">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900 hidden md:block">
            {t("control:portafolio:receipt:title")}
          </h1>
          <div className="flex-grow">
            <div className="flex border px-1 py-1 bg-gray-300 items-center rounded-md gap-x-2">
              <FiltersReceipt />
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
