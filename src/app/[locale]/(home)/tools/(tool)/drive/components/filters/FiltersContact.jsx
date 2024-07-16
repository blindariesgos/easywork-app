"use client";
import { Menu, MenuButton, Transition, MenuItems, TransitionChild } from "@headlessui/react";
import React, { Fragment, useState, useRef, useEffect } from "react";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import FormFilters from "./FormFilters";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
const FiltersContact = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "Mis carpetas",
      selected: false,
    },
    {
      id: 2,
      name: "Todas mis carpetas",
      selected: false,
    },
  ]);


  const handleSelected = (id) => {
    const updateSelection = contacts.map((cont) => {
      return cont.id === id
        ? { ...cont, selected: !cont.selected }
        : { ...cont, selected: false };
    });
    setContacts(updateSelection);
  };

  return (
    <Menu>
      <div className="flex items-center w-full justify-between">
        <div className="flex items-center w-full">
          <FaMagnifyingGlass className="h-4 w-4 text-primary" />
          <input
            type="search"
            name="search"
            id="search-cal"
            className="block w-full py-1.5 text-primary placeholder:text-primary sm:text-sm border-0 focus:ring-0 bg-gray-300"
            value={searchInput}
            placeholder={t("contacts:header:search")}
            onChange={(e) => setSearchInput(e.target.value)}
            onClick={() => setSearchInput("")}
          />
        </div>
        <MenuButton className="pr-2" onClick={() => setSearchInput("")}>
          <IoIosArrowDown className="h-4 w-4 text-primary" />
        </MenuButton>
      </div>
      <Transition as={Fragment}>
        <TransitionChild
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems
            anchor="bottom end"
            className={` mt-2 rounded-md bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none w-fit h-auto`}
          >
            <div className="p-4">
              <div className="flex gap-4 flex-col sm:flex-row">
                <div className="bg-gray-150 flex flex-col w-full sm:w-40 px-4 py-2 rounded-md relative">
                  <p className="text-xs text-gray-60 text-center">
                    {t("contacts:filters:name")}
                  </p>
                  <div className="mt-4 flex flex-col gap-2 mb-14">
                    {contacts &&
                      contacts.map((cont, index) => (
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
                        {t("contacts:filters:save")}
                      </p>
                    </div>
                  </div>
                </div>
                <FormFilters />
              </div>
            </div>
          </MenuItems>
        </TransitionChild>
      </Transition>
    </Menu>
  );
};

export default FiltersContact;
