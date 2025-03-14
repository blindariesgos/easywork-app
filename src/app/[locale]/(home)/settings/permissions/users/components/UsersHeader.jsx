"use client";
import React from "react";
import {
  ChevronDownIcon,
  Cog8ToothIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import ContactSubMenu from "./ContactSubMenu";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../../components/form/Button";
import useAppContext from "../../../../../../../context/app";
import { TrashIcon } from "@heroicons/react/24/outline";
import FiltersContact from "./filters/FiltersUser";
import { useCommon } from "../../../../../../../hooks/useCommon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import IconDropdown from "../../../../../../../components/SettingsButton";
import useCrmContext from "../../../../../../../context/crm";
import ActiveFiltersDrawer from "@/src/components/ActiveFiltersDrawer";
import useUserContext from "@/src/context/users";

export default function UsersHeader() {
  const { t } = useTranslation();
  const { trash, settingsUser: settings } = useCommon();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { push } = useRouter();
  const { selectedContacts } = useCrmContext();
  const { displayFilters, removeFilter } = useUserContext();

  const handlePathname = () => {
    params.delete("page");
    params.set("inviteuser", true);
    push(`${pathname}?${params.toString()}`);
  };

  return (
    <header className="flex flex-col">
      <div className="px-4 gap-2 grid grid-cols-1 bg-white py-4 rounded-md shadow-sm">
        <div className="flex gap-3 items-center flex-wrap ">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900 hidden md:block">
            Lista de Usuarios
          </h1>
          <Button
            label={"Invitar"}
            type="button"
            onclick={() => handlePathname()}
            buttonStyle={"primary"}
            icon={<ChevronDownIcon className="ml-2 h-5 w-5 text-white" />}
            className="px-3 py-2"
          />
          <div className="flex-grow">
            <div className="flex border px-1 py-1 bg-gray-300 items-center rounded-md gap-x-2">
              <FiltersContact />
            </div>
          </div>

          <IconDropdown
            icon={
              <Cog8ToothIcon
                className="h-8 w-8 text-primary"
                aria-hidden="true"
              />
            }
            options={settings}
            width="w-[150px]"
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
