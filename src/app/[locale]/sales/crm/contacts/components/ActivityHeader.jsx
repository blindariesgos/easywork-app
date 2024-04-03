import clsx from "clsx";
import React from "react";

const tabs = [
  { name: "Correo", href: "#", current: true, disabled: false },
  { name: "Tareas", href: "#", current: false, disabled: true },
  { name: "Whatsapp", href: "#", current: false, disabled: true },
  { name: "Comentario", href: "#", current: false, disabled: true },
  { name: "Citas", href: "#", current: false, disabled: true },
];

export default function ActivityHeader() {
  return (
    <>
      <div className="bg-white px-2 rounded-md w-full shadow-sm">
        <div className="bg-white">
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
            <select
              id="tabs"
              name="tabs"
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              defaultValue={tabs.find((tab) => tab.current).name}
            >
              {tabs.map((tab) => (
                <option key={tab.name}>{tab.name}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                  <a
                    key={tab.name}
                    href={tab.href}
                    className={clsx(
                      tab.current
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                      "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                    )}
                    aria-current={tab.current ? "page" : undefined}
                  >
                    {tab.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="py-2">
          <label htmlFor="todo" className="sr-only">
            Email
          </label>
          <input
            type="text"
            name="todo"
            id="todo"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Tareas por hacer"
          />
        </div>
      </div>

    </>
  );
}
