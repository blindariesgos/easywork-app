"use client";
import useAppContext from "../../context/app";
import { Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";

import React, { Fragment } from "react";
import SearchBox from "../SearchBox";
import Clock from "./Clock";
import Status from "./Status";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import { logout } from "../../lib/apis";
import { useSession } from "next-auth/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  function ifWebmailPath() {
    if (pathname === "/tools/webmail") return true;
  }

  const { t } = useTranslation();
  const {
    setSidebarOpen,
    setSidebarOpenEmail,
    sidebarOpenDesktop1,
    setSidebarOpenDesktop1,
    setSidebarOpenDesktop2,
  } = useAppContext();
  const userNavigation = [
    { name: t("common:header:profile"), href: "#" },
    { name: t("common:header:signout"), href: "#", onClick: () => logout() },
  ];

  return (
    <div className="h-20">
      <div className="rounded-2xl mx-auto z-10 flex h-16 shrink-0 items-center gap-x-4 bg-white opacity-90 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        {ifWebmailPath() ? (
          <button
            type="button"
            className="p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpenEmail(true)}
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        ) : (
          <>
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 max-lg:hidden"
              onClick={() => {
                const newState = !sidebarOpenDesktop1;
                setSidebarOpenDesktop1(newState);
                setSidebarOpenDesktop2(newState);
              }}
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </>
        )}

        {/* Separator */}
        <div className="h-6 w-px bg-gray-900/10" aria-hidden="true" />

        <div className="flex justify-between flex-1 gap-x-4 lg:gap-x-6">
          {/*  */}
          <SearchBox />
          <div className="flex items-center gap-x-2 lg:gap-x-6">
            {/* Profile dropdown */}
            <Menu
              as="div"
              className="relative hover:bg-slate-50/30 w-10 md:w-auto py-2 px-1 rounded-lg"
            >
              <Menu.Button className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">Open user menu</span>
                <Image
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full bg-gray-50"
                  src={session?.user?.avatar}
                  alt=""
                />
                <span className="hidden lg:flex lg:items-center">
                  <span
                    className="ml-4 text-sm font-semibold leading-6 text-black"
                    aria-hidden="true"
                  >
                    {`${session?.user?.name}`}
                  </span>
                  <ChevronDownIcon
                    className="ml-2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
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
                <Menu.Items className="absolute right-0 z-50 mt-2.5 w-32 rounded-md bg-white py-2 shadow-lg focus:outline-none">
                  {userNavigation.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <div
                          onClick={item.onClick}
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
            {/* Separator */}
            <div
              className="hidden lg:block lg:h-10 lg:w-px lg:bg-gray-900/10"
              aria-hidden="true"
            />

            <Clock />

            {/* Separator */}
            <div
              className="hidden lg:block lg:h-10 lg:w-px lg:bg-gray-900/10"
              aria-hidden="true"
            />

            <Status />
          </div>
        </div>
      </div>
    </div>
  );
}
