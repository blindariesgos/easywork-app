"use client";
import { Menu, MenuButton, MenuItems, Transition, TransitionChild } from "@headlessui/react";
import React, { Fragment, useState, useEffect, useRef } from "react";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import FormFilters from "./FormFilters";
import { useTasksConfigs } from "@/src/hooks/useCommon";
import { FaMagnifyingGlass } from "react-icons/fa6";
// import FormFilters from './FormFilters';
import { IoIosArrowDown } from "react-icons/io";
import useTasksContext from "@/src/context/tasks";

const FiltersTasks = () => {
  const { t } = useTranslation();
  const { status, setStatus } = useTasksConfigs();
  const [searchInput, setSearchInput] = useState("");
  const { filters, setFilters } = useTasksContext()

  const handleSelected = (id) => {
    const updateSelection = status.map((cont) => {
      return cont.id === id
        ? { ...cont, selected: !cont.selected }
        : { ...cont, selected: false };
    });
    setStatus(updateSelection);
  };

  useEffect(() => {
    if (searchInput.length > 0) {
      setFilters({
        ...filters,
        name: searchInput
      })
    } else {
      const { name, ...otherFilters } = filters;
      setFilters(otherFilters)
    }
  }, [searchInput])

  return (
    <Menu as="div" className="relative inline-block w-full">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center w-full">
          <FaMagnifyingGlass className="h-4 w-4 text-primary" />
          <input
            type="search"
            name="search"
            id="search-cal"
            className="block w-full py-1.5 text-primary placeholder:text-primary sm:text-sm border-0 focus:ring-0 bg-gray-300"
            placeholder={t("contacts:header:search")}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <MenuButton className="pr-2" onClick={() => setSearchInput("")}>
          <IoIosArrowDown className="h-4 w-4 text-primary" />
        </MenuButton>
      </div>
      <MenuItems
        transition
        className={`absolute right-0 mt-2 rounded-md bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 w-fit`}
      >
        <div className="p-4">
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="bg-gray-150 flex flex-col w-full sm:w-40 px-4 py-2 rounded-md relative">
              <p className="text-xs text-gray-60 text-center">
                {t("tools:filters:name")}
              </p>
              <div className="mt-4 flex flex-col gap-2 mb-14">
                {status &&
                  status.map((cont, index) => (
                    <div
                      key={index}
                      className="cursor-pointer"
                      onClick={() => handleSelected(cont.id)}
                    >
                      <p
                        className={`text-sm uppercase  ${cont.selected
                          ? "text-primary font-medium"
                          : "text-gray-60"
                          }`}
                      >
                        {cont.name}
                      </p>
                    </div>
                  ))}
              </div>
              <div className="absolute bottom-2">
                <div className="flex gap-2 cursor-pointer items-center">
                  <PlusIcon className="h-3 w-3 text-gray-60" />
                  <p className="text-xs uppercase text-gray-60">
                    {t("tools:filters:save")}
                  </p>
                </div>
              </div>
            </div>
            <FormFilters />
          </div>
        </div>
      </MenuItems>
    </Menu>
  );
};

export default FiltersTasks;
