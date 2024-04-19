'use client';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import React from 'react'
import { Disclosure, } from "@headlessui/react";
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { useSidebar } from '../hooks/useCommon';

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
const SidebarMenu = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const paramsPathname = `${pathname}?${new URLSearchParams(searchParams).toString() || ""}`
    const { sidebarNavigation } = useSidebar();
    return (        
        <nav className="flex flex-1 flex-col mt-3">
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
                                            ? "bg-primary text-white"
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
                                        <Link href={item.href}>
                                            <Disclosure.Button
                                                className={classNames(
                                                item.href === pathname
                                                    ? "bg-primary text-white"
                                                    : "text-slate-50 hover:text-white hover:bg-easy-300",
                                                "flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold uppercase"
                                                )}
                                            >
                                                <item.icon
                                                className={classNames(
                                                    open
                                                    ? "rotate-90 text-slate-50"
                                                    : "text-slate-50",
                                                    "h-7 w-7"
                                                )}
                                                aria-hidden="true"
                                                />
                                                {item.name}
                                            </Disclosure.Button>
                                        </Link>
                                        <Disclosure.Panel as="ul" className="mt-1 px-2">
                                            {item.children.map((subItem) => (
                                                <li key={subItem.name}>
                                                    {!subItem.children ? (
                                                        <Link
                                                            href={subItem.href}
                                                            className={classNames(
                                                            subItem.href === pathname
                                                                ? "bg-primary text-white"
                                                                : "text-slate-50 hover:text-white hover:bg-easy-300",
                                                            "block rounded-md py-2 pr-2 pl-9 text-sm leading-6"
                                                            )}
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    ) : (
                                                    <Disclosure as={"div"}>
                                                        {({ open }) => (
                                                            <>
                                                                <Link href={subItem.href}>
                                                                    <Disclosure.Button
                                                                        className={classNames(
                                                                            subItem.href === pathname
                                                                            ? "bg-primary text-white"
                                                                            : "text-slate-50 hover:text-white hover:bg-easy-300",
                                                                            "flex items-center w-full text-left rounded-md p-2  pl-9 gap-x-3 text-sm leading-6 font-semibold uppercase"
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
                                                                            {subItem.name}
                                                                    </Disclosure.Button>
                                                                </Link>                                                                
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
                                                                                    subSubItem.href === paramsPathname
                                                                                    ? "bg-primary text-white"
                                                                                    : "text-slate-50 hover:text-white hover:bg-easy-300",
                                                                                    "block rounded-md py-2 pr-2 pl-9 text-sm leading-6 ml-6"
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
    )
}

export default SidebarMenu;
