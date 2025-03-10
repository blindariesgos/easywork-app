import { Fragment } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import {
  Menu,
  MenuItem,
  MenuItems,
  Transition,
  MenuButton,
} from "@headlessui/react";

export function DropDownMenu({ options, label }) {
  return (
    <div className="md:inline-flex rounded-md shadow-sm hidden">
      <div className="relative inline-flex items-center rounded-l-md bg-primary px-3 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-indigo-600 hover:bg-indigo-500 focus:z-10">
        {label}
      </div>

      <Menu as="div" className="relative -ml-px block">
        <MenuButton className="relative inline-flex items-center rounded-r-md bg-primary px-2 py-2 text-white ring-1 ring-inset ring-indigo-600 hover:bg-indigo-500 focus:z-10">
          {/* <span className="sr-only">{t("tools:calendar:open")}</span> */}
          <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
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
            anchor="bottom end"
            className="z-10 -mr-1 mt-2 w-28 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div className="py-1">
              {options.map((item) => (
                <MenuItem key={item.name} className="group">
                  <Link
                    href={item.href}
                    className={clsx(
                      "group-data-[focus]:bg-gray-100 group-data-[focus]:text-gray-900",
                      "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    {item.name}
                  </Link>
                </MenuItem>
              ))}
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}
