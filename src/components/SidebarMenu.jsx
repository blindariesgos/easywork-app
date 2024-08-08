"use client";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { useSidebar } from "../hooks/useCommon";
import { useRef } from "react";
import { useResizeDetector } from "react-resize-detector";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const SidebarMenu = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramsPathname = `${pathname}${
    new URLSearchParams(searchParams).toString().length
      ? `?${new URLSearchParams(searchParams).toString().length}`
      : ""
  }`;
  const { sidebarNavigation } = useSidebar();
  const { width, height, ref } = useResizeDetector();

  return (
    <nav className="flex flex-1 flex-col mt-3" ref={ref}>
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {sidebarNavigation.map((item) => (
              <li key={item.name}>
                {!item.children ? (
                  <Link
                    href={item.href.length ? item.href : "/construction"}
                    className={classNames(
                      item.href === pathname
                        ? "bg-primary text-white"
                        : "text-slate-50 hover:text-white hover:bg-easy-300",
                      "flex items-center w-full text-left rounded-md p-2 gap-x-1 text-sm leading-6 font-semibold uppercase"
                    )}
                  >
                    <div className="h-6 w-6" />
                    {width < 100 ? (
                      <item.iconShortBar className="h-7 w-7 shrink-0" />
                    ) : (
                      item.name
                    )}
                  </Link>
                ) : (
                  <Disclosure as="div">
                    {({ open }) => (
                      <>
                        <Link
                          href={item.href.length ? item.href : "/construction"}
                        >
                          <DisclosureButton
                            className={classNames(
                              item.href === pathname
                                ? "bg-primary text-white"
                                : "text-slate-50 hover:text-white hover:bg-easy-300",
                              "flex items-center w-full text-left rounded-md p-2 gap-x-1 text-sm leading-6 font-semibold uppercase"
                            )}
                          >
                            <item.icon
                              className={classNames(
                                open
                                  ? "rotate-90 text-slate-50"
                                  : "text-slate-50",
                                "h-5 w-5 shrink-0 transition-all"
                              )}
                              aria-hidden="true"
                            />

                            {width < 100 ? (
                              <item.iconShortBar className="h-7 w-7 shrink-0" />
                            ) : (
                              item.name
                            )}
                          </DisclosureButton>
                        </Link>
                        <DisclosurePanel as="ul" className="mt-1 px-2">
                          {item.children.map((subItem) => (
                            <li key={subItem.name}>
                              {!subItem.children ? (
                                <Link
                                  href={
                                    subItem.href.length
                                      ? subItem.href
                                      : "/construction"
                                  }
                                  className={classNames(
                                    subItem.href === pathname
                                      ? "bg-primary text-white"
                                      : "text-slate-50 hover:text-white hover:bg-easy-300",
                                    "block rounded-md py-2 pr-2",
                                    width < 100 ? "" : "pl-9",
                                    "text-sm leading-6"
                                  )}
                                >
                                  {width < 100 ? (
                                    <div className="flex justify-center items-center">
                                      <subItem.iconShortBar className="h-5 w-5 shrink-0" />
                                    </div>
                                  ) : (
                                    subItem.name
                                  )}
                                </Link>
                              ) : (
                                <Disclosure as={"div"}>
                                  {({ open }) => (
                                    <>
                                      <Link
                                        href={
                                          subItem.href.length
                                            ? subItem.href
                                            : "/construction"
                                        }
                                      >
                                        <DisclosureButton
                                          className={classNames(
                                            subItem.href === pathname
                                              ? "bg-primary text-white"
                                              : "text-slate-50 hover:text-white hover:bg-easy-300",
                                            "flex items-center w-full text-left rounded-md p-2 gap-x-1 text-sm leading-6 font-semibold uppercase",
                                            width < 100 ? "" : "pl-9"
                                          )}
                                        >
                                          <ChevronRightIcon
                                            className={classNames(
                                              open
                                                ? "rotate-90 text-slate-50"
                                                : "text-slate-50",
                                              "h-5 w-5 shrink-0"
                                            )}
                                            aria-hidden="true"
                                          />
                                          {width < 100 ? (
                                            <div className="flex justify-center items-center">
                                              <subItem.iconShortBar className="h-5 w-5 shrink-0" />
                                            </div>
                                          ) : (
                                            subItem.name
                                          )}
                                        </DisclosureButton>
                                      </Link>
                                      <DisclosurePanel
                                        as="ul"
                                        className="mt-1 px-2"
                                      >
                                        {subItem.children.map((subSubItem) => (
                                          <li key={subSubItem.name}>
                                            <Link
                                              href={
                                                subSubItem.href.length
                                                  ? subSubItem.href
                                                  : "/construction"
                                              }
                                              className={classNames(
                                                subSubItem.href === pathname
                                                  ? "bg-primary text-white"
                                                  : "text-slate-50 hover:text-white hover:bg-easy-300",
                                                "block rounded-md py-2 pr-2 text-sm leading-6 ml-6",
                                                width < 100 ? "" : "pl-9"
                                              )}
                                            >
                                              {width < 100 ? (
                                                <div className="flex justify-center items-center">
                                                  <subItem.iconShortBar className="h-5 w-5 shrink-0" />
                                                </div>
                                              ) : (
                                                subSubItem.name
                                              )}
                                            </Link>
                                          </li>
                                        ))}
                                      </DisclosurePanel>
                                    </>
                                  )}
                                </Disclosure>
                              )}
                            </li>
                          ))}
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                )}
              </li>
            ))}
          </ul>
        </li>

        {/* <li className="mt-auto">
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
            </li> */}
      </ul>
    </nav>
  );
};

export default SidebarMenu;
