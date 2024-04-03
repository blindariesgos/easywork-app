"use client"
import useAppContext from "@/context/app";
import { contactDetailTabs } from "@/lib/common";
import clsx from "clsx";
import React from "react";

const tabs = [
  { name: "General", value: 0 },
  { name: "Pólizas", value: 1 },
  { name: "Actividades", value: 2 },
  { name: "Reportes", value: 3 },
  { name: "Documentos", value: 4 },
];

export default function AddContactTabs() {
  const {setContactDetailTab, contactDetailTab} = useAppContext()

  return (
    <div className="bg-white px-4 w-full rounded-lg">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Seleccione una pestaña
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          defaultValue={tabs.find((tab) => tab.value).name}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div>
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <div
                key={tab.name}
                onClick={() => setContactDetailTab(contactDetailTabs[tab.value])}
                className={clsx(
                  tab.value === contactDetailTabs.indexOf(contactDetailTab)
                    ? "border-indigo-500 text-indigo-600"
                    : tab.disabled
                    ? "border-transparent text-gray-300 cursor-default"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium cursor-pointer"
                )}
                aria-current={tab.current ? "page" : undefined}
              >
                {tab.name}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
