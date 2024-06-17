"use client";
import React, {Fragment} from "react";
import CreateDocumentButton from "./CreateDocument";
import { Cog8ToothIcon, TrashIcon } from "@heroicons/react/20/solid";
import DriveBreadcrumb from "./DriveBreadcrumb";
import { useTranslation } from "react-i18next";
import {
  ChevronDownIcon,
  Bars3Icon,
  Squares2X2Icon,
} from "@heroicons/react/16/solid";
import Image from "next/image";
import useAppContext from "../../../../../../../context/app";
import FiltersContact from "./filters/FiltersContact";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Menu, Transition } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DriveHeader() {
  const { t } = useTranslation();
  const { setDriveView } = useAppContext();

  const itemOptions = [
    { name: t("tools:drive:organizer:by-name") },
    { name: t("tools:drive:organizer:by-id") },
    { name: t("tools:drive:organizer:by-size") },
    { name: t("tools:drive:organizer:by-change-date") },
    { name: t("tools:drive:organizer:reverse") },
    { name: t("tools:drive:organizer:mixed-classification") },
    { name: "Ascendente" },
    { name: "Descendientes" },
  ];

  return (
    <header className="flex flex-col">
      <div className="lg:px-6 px-2 flex gap-3 items-center bg-white py-4 rounded-md">
        <h1 className="text-2xl font-medium leading-6 text-easywork-main hidden md:block">
          {t("tools:drive:name")}
        </h1>
        <CreateDocumentButton />
        <div className="flex-grow">
          <div className="flex border px-1 py-1 bg-gray-300 items-center rounded-md gap-x-2">
            <FiltersContact />
            {/* <div className="flex items-center w-full">
							<FaMagnifyingGlass className="h-4 w-4 text-primary" />
							<input
								type="search"
								name="search"
								id="search-cal"
								className="block w-full py-1.5 text-primary placeholder:text-primary sm:text-sm border-0 focus:ring-0 bg-gray-300"
								placeholder={t('contacts:header:search')}
							/>
						</div> */}
          </div>
        </div>
        {/* <div className="flex-grow">
          <label htmlFor="search" className="sr-only">
            {t("tools:drive:search")}
          </label>
          <input
            type="search"
            name="search"
            id="search-cal"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder={t("tools:drive:filter")}
          />
        </div> */}
        {/* <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <TrashIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
        </button> */}
        <Menu as="div" className="relative hover:bg-slate-50/30 w-10 md:w-auto py-2 px-1 rounded-lg">
            <Menu.Button className="inline-flex items-center gap-x-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              <Cog8ToothIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-50 mt-2.5 w-40 rounded-md bg-white py-2 shadow-lg focus:outline-none">
          
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        className={classNames(
                          active ? "bg-gray-50" : "",
                          "block px-3 py-1 text-sm leading-6 text-black cursor-pointer"
                        )}
                      >
                        Asignar permisos
                      </div>
                    )}
                  </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
      </div>

      <div className="flex-none items-center justify-between border-b border-gray-200 py-4 hidden lg:flex">
        <DriveBreadcrumb />
        <div className="flex mr-3">
          <Menu as="div" className="relative hover:bg-slate-50/30 w-10 md:w-auto py-2 px-1 rounded-lg">
            <Menu.Button className="flex text-gray-400 border-r-2 pr-2">
              <p className="text-nowrap">
                {t("tools:drive:organizer:by-name")}
              </p>
              <ChevronDownIcon className="h-6 w-6" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute left-0 z-50 mt-2.5 w-40 rounded-md bg-white py-2 shadow-lg focus:outline-none">
                {itemOptions.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <div
                        className={classNames(
                          active ? "bg-gray-50" : "",
                          "block px-3 py-1 text-sm leading-6 text-black cursor-pointer"
                        )}
                      >
                        {item.name}
                      </div>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
          <div className="flex text-easywork-main">
            <Bars3Icon
              className="h-6 w-6 ml-1"
              onClick={() => setDriveView("table")}
            />
            <Squares2X2Icon
              className="h-6 w-6 ml-1"
              onClick={() => setDriveView("icon")}
            />
            <Image
              className="h-6 w-5 ml-1 fill-easywork-main"
              src="/icons/grid-3x3.svg"
              alt="big icons"
              width={18}
              height={18}
              onClick={() => setDriveView("thumb")}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
