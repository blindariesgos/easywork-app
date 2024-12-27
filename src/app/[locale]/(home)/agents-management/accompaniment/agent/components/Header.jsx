"use client";
import React, { Fragment } from "react";
import { Cog8ToothIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import FilterAccompaniments from "./FilterAccompaniments";
import { useCommon } from "@/src/hooks/useCommon";
import IconDropdown from "@/src/components/SettingsButton";
import useCrmContext from "@/src/context/crm";
import ActiveFiltersDrawer from "@/src/components/ActiveFiltersDrawer";
import useAccompanimentsContext from "@/src/context/accompaniments";
import clsx from "clsx";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function AccompanimentsHeader() {
  const { t } = useTranslation();
  const { trash, settingsReceipts: settings } = useCommon();
  const { selectedContacts } = useCrmContext();
  const { displayFilters, removeFilter } = useAccompanimentsContext();
  const router = useRouter();

  const options = [
    {
      name: "Agente",
      onclick: () =>
        router.push("/agents-management/accompaniment/agent?show=true"),
    },
    {
      name: "Tarea",
      onclick: () => router.push("/tools/tasks/task?show=true"),
    },
    {
      name: "Cita con Prospectos o Clientes",
      onclick: () => router.push("/tools/calendar/addEvent?show=true"),
    },
    {
      name: "Junta",
      options: [
        {
          name: "Individual",
          onclick: () =>
            router.push(
              "/agents-management/meetings-and-sessions/individuals/meet?show=true"
            ),
        },
        {
          name: "De Equipo",
          onclick: () =>
            router.push(
              "/agents-management/meetings-and-sessions/teams/meet?show=true"
            ),
        },
      ],
    },
    { name: "Asignar GDD", disabled: true },
  ];

  return (
    <header className="flex flex-col">
      <div className="px-4 flex flex-col gap-2  bg-white py-4 rounded-md shadow-sm w-full">
        <div className="flex gap-3 flex-wrap w-full items-center">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900 hidden md:block">
            {t("agentsmanagement:accompaniments:title")}
          </h1>
          <Menu>
            <MenuButton className="py-2 px-4 bg-primary hover:bg-easy-500 text-white disabled:opacity-50 shadow-sm text-sm flex items-center gap-x-2 rounded-md  font-medium outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 justify-center">
              Agregar
              <FaChevronDown className="w-4 h-4" />
            </MenuButton>
            <MenuItems
              transition
              anchor="bottom start"
              className="rounded-md mt-2 bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 grid grid-cols-1 gap-2 p-2 "
            >
              {options.map((option, index) =>
                !option.options ? (
                  <MenuItem
                    key={index}
                    as="div"
                    onClick={option.onclick && option.onclick}
                    disabled={option.disabled}
                    className="px-2 py-1 hover:[&:not(data-[disabled])]:bg-gray-100 rounded-md text-sm cursor-pointer data-[disabled]:cursor-auto data-[disabled]:text-gray-50"
                  >
                    {option.name}
                  </MenuItem>
                ) : (
                  <Menu key={option.name}>
                    <MenuButton className="px-2 py-1 flex items-center justify-between hover:[&:not(data-[disabled])]:bg-gray-100 rounded-md text-sm cursor-pointer data-[disabled]:cursor-auto data-[disabled]:text-gray-50">
                      {option.name}
                      <ChevronRightIcon className="h-6 w-6 ml-2" />
                    </MenuButton>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <MenuItems
                        anchor={{
                          to: "right start",
                          gap: "4px",
                        }}
                        className="rounded-md bg-white py-2 shadow-lg focus:outline-none z-50"
                      >
                        {option.options.map((option2) => (
                          <MenuItem
                            key={option2.name}
                            disabled={option2.disabled}
                            onClick={() => {
                              option2.onclick && option2.onclick();
                            }}
                          >
                            <div
                              className={clsx(
                                "px-2 py-1 flex items-center justify-between hover:[&:not(data-[disabled])]:bg-gray-100 rounded-md text-sm cursor-pointer data-[disabled]:cursor-auto data-[disabled]:text-gray-50"
                              )}
                            >
                              {option2.name}
                            </div>
                          </MenuItem>
                        ))}
                      </MenuItems>
                    </Transition>
                  </Menu>
                )
              )}
            </MenuItems>
          </Menu>
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
