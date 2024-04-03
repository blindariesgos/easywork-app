"use client";
import { Fragment } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { Cog6ToothIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import useAppContext from "@/context/app";
import Link from "next/link";
import { sidebarNavigation } from "@/lib/common";
import { useTranslation } from "react-i18next";

const teams = [
  { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppContext();
  const { t } = useTranslation();

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-easy-500 px-6 pb-4 ring-1 ring-white/10">
                  <div className="flex h-16 shrink-0 items-center">
                    <Image
                      width={32}
                      height={32}
                      className="h-8 w-auto"
                      src="/img/Layer_2.png"
                      alt="Your Company"
                    />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {sidebarNavigation.map((item) => (
                            <li key={item.name}>
                              {!item.children ? (
                                <a
                                  href={item.href}
                                  className={classNames(
                                    item.current
                                      ? "bg-gray-50"
                                      : "hover:bg-gray-50",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700"
                                  )}
                                >
                                  <item.icon
                                    className="h-6 w-6 shrink-0 text-gray-400"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </a>
                              ) : (
                                <Disclosure as="div">
                                  {({ open }) => (
                                    <>
                                      <Disclosure.Button
                                        className={classNames(
                                          item.current
                                            ? "bg-gray-50"
                                            : "hover:bg-gray-50",
                                          "flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-gray-700"
                                        )}
                                      >
                                        <item.icon
                                          className="h-6 w-6 shrink-0 text-gray-400"
                                          aria-hidden="true"
                                        />
                                        {item.name}
                                        <ChevronRightIcon
                                          className={classNames(
                                            open
                                              ? "rotate-90 text-gray-500"
                                              : "text-gray-400",
                                            "ml-auto h-5 w-5 shrink-0"
                                          )}
                                          aria-hidden="true"
                                        />
                                      </Disclosure.Button>
                                      <Disclosure.Panel
                                        as="ul"
                                        className="mt-1 px-2"
                                      >
                                        {item.children.map((subItem) => (
                                          <li key={subItem.name}>
                                            {/* 44px */}
                                            <Disclosure.Button
                                              as="a"
                                              href={subItem.href}
                                              className={classNames(
                                                subItem.current
                                                  ? "bg-gray-50"
                                                  : "hover:bg-gray-50",
                                                "block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-gray-700"
                                              )}
                                            >
                                              {subItem.name}
                                            </Disclosure.Button>
                                          </li>
                                        ))}
                                      </Disclosure.Panel>
                                    </>
                                  )}
                                </Disclosure>
                              )}
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li>
                        <div className="text-xs font-semibold leading-6 text-gray-400">
                          Your teams
                        </div>
                        <ul role="list" className="-mx-2 mt-2 space-y-1">
                          {teams.map((team) => (
                            <li key={team.name}>
                              <a
                                href={team.href}
                                className={classNames(
                                  team.current
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                )}
                              >
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                                  {team.initial}
                                </span>
                                <span className="truncate">{team.name}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="mt-auto">
                        <a
                          href="#"
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                        >
                          <Cog6ToothIcon
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
                          Settings
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-easy-700 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center mx-auto mt-2">
            <Link href="/">
              <Image
                width={72}
                height={72}
                className="h-16 w-auto"
                src="/img/Layer_2.png"
                alt="EasyWork"
              />
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {sidebarNavigation.map((item) => (
                    <li key={item.name}>
                      {!item.children ? (
                        <Link
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-easy-500 text-white"
                              : "text-slate-50 hover:text-white hover:bg-easy-800",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      ) : (
                        <Disclosure as="div">
                          {({ open }) => (
                            <>
                              <Disclosure.Button
                                className={classNames(
                                  item.current
                                    ? "bg-easy-500 text-white"
                                    : "text-slate-50 hover:text-white hover:bg-easy-600",
                                  "flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold"
                                )}
                              >
                                <item.icon
                                  className="h-6 w-6 shrink-0"
                                  aria-hidden="true"
                                />
                                {item.name}
                                <ChevronRightIcon
                                  className={classNames(
                                    open
                                      ? "rotate-90 text-slate-50"
                                      : "text-slate-50",
                                    "ml-auto h-5 w-5 shrink-0"
                                  )}
                                  aria-hidden="true"
                                />
                              </Disclosure.Button>
                              <Disclosure.Panel as="ul" className="mt-1 px-2">
                                {item.children.map((subItem) => (
                                  <li key={subItem.name}>
                                    {!subItem.children ? (
                                      <Link
                                        href={subItem.href}
                                        className={classNames(
                                          subItem.current
                                            ? "bg-easy-600 text-white"
                                            : "text-slate-50 hover:text-white hover:bg-easy-600",
                                          "block rounded-md py-2 pr-2 pl-9 text-sm leading-6"
                                        )}
                                      >
                                        {subItem.name}
                                      </Link>
                                    ) : (
                                      <Disclosure as={"div"}>
                                        {({ open }) => (
                                          <>
                                            <Disclosure.Button
                                              className={classNames(
                                                subItem.current
                                                  ? "bg-easy-600 text-white"
                                                  : "text-slate-50 hover:text-white hover:bg-easy-600",
                                                "flex items-center w-full text-left rounded-md p-2  pl-9 gap-x-3 text-sm leading-6 font-semibold"
                                              )}
                                            >
                                              {subItem.name}
                                              <ChevronRightIcon
                                                className={classNames(
                                                  open
                                                    ? "rotate-90 text-slate-50"
                                                    : "text-slate-50",
                                                  "ml-auto h-5 w-5 shrink-0"
                                                )}
                                                aria-hidden="true"
                                              />
                                            </Disclosure.Button>
                                            <Disclosure.Panel
                                              as="ul"
                                              className="mt-1 px-2"
                                            >
                                              {subItem.children.map(
                                                (subSubItem) => (
                                                  <li key={subSubItem.name}>
                                                    <Link
                                                      href={subSubItem.href}
                                                      className={classNames(
                                                        subItem.current
                                                          ? "bg-easy-600 text-white"
                                                          : "text-slate-50 hover:text-white hover:bg-easy-600",
                                                        "block rounded-md py-2 pr-2 pl-9 text-sm leading-6"
                                                      )}
                                                    >
                                                      {subSubItem.name}
                                                    </Link>
                                                  </li>
                                                )
                                              )}
                                            </Disclosure.Panel>
                                          </>
                                        )}
                                      </Disclosure>
                                    )}
                                  </li>
                                ))}
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      )}
                    </li>
                  ))}
                </ul>
              </li>

              <li className="mt-auto">
                <a
                  href="#"
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  <Cog6ToothIcon
                    className="h-6 w-6 shrink-0"
                    aria-hidden="true"
                  />
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
