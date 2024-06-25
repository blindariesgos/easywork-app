import { Menu, Transition } from "@headlessui/react";
import React, { Fragment, useState, useRef, useEffect } from "react";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import FormFilters from "./FormFilters";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function ToolHeader({
  title,
  ActionButton,
  ToolsButtons,
  children,
}) {
  const { t } = useTranslation();
  const ref = useRef(null);
  const [searchInput, setSearchInput] = useState(" ");
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setSearchInput(" ");
      }
    };

    document.body.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.body.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const handleSelected = (id) => {
    const updateSelection = contacts.map((cont) => {
      return cont.id === id
        ? { ...cont, selected: !cont.selected }
        : { ...cont, selected: false };
    });
    setContacts(updateSelection);
  };

  return (
    <header className="flex flex-col">
      <div className="lg:px-6 px-2 flex justify-between items-center bg-white py-4 rounded-md">
        {/* <h1 className="text-2xl font-semibold leading-6 text-gray-900 hidden md:block">
          {title}
        </h1> */}
        <div className="flex gap-3 items-center">
          {ActionButton}
          {/* <div className="bg-white flex justify-around rounded-md py-2 px-4">
            <button className="bg-easywork-main flex text-white rounded-md px-2">
              Filtros <span className="ml-1 font-semibold">INBOX</span>
            </button>
            <p className="text-easywork-main ml-2">Busqueda</p>
          </div> */}
          <Menu as="div" className="relative inline-block">
            <div>
              {/* <Menu.Button className="inline-flex w-full bg-primary hover:bg-easy-500 text-white rounded-md text-xs px-1.5 py-1 gap-1">
					{t('contacts:filters:name')}
					<ChevronDownIcon className="h-4 w-4 -rotate-180" />
				</Menu.Button> */}
              <div className="flex items-center w-full">
                <FaMagnifyingGlass className="h-4 w-4 text-primary" />
                <input
                  type="search"
                  name="search"
                  id="search-cal"
                  className="block w-full py-1.5 text-primary placeholder:text-primary sm:text-sm border-0 focus:ring-0 bg-white"
                  placeholder={t("contacts:header:search")}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onClick={() => setSearchInput("")}
                />
              </div>
            </div>
            <Transition.Root show={searchInput === ""} as={Fragment}>
              <Transition.Child
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  className={`absolute left-0 mt-2 rounded-md bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 w-fit`}
                >
                  <div className="p-4" ref={ref}>
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
                                  className={`text-sm uppercase  ${
                                    cont.selected
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
                </Menu.Items>
              </Transition.Child>
            </Transition.Root>
          </Menu>
        </div>
        {/* <div className="flex-grow">
          <label htmlFor="search" className="sr-only">
            {t('tools:tasks:search')}
          </label>
          <input
            type="search"
            name="search"
            id="search-cal"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder={t('tools:tasks:search')}
          />
        </div> */}
        {ToolsButtons}
      </div>

      {children}
    </header>
  );
}
