import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";
import AppointmentMenu from "./AppointmentMenu";

export default function ActivityHeader() {
  const { t } = useTranslation();
  const tabs = [
    { name: t('contacts:create:activities:email'), href: "#", current: true, disabled: false },
    { name: t('contacts:create:activities:tasks'), href: "#", current: false, disabled: true },
    { name: t('contacts:create:activities:whatsapp'), href: "#", current: false, disabled: true },
    { name: t('contacts:create:activities:comment'), href: "#", current: false, disabled: true },
    { name: t('contacts:create:activities:appointments'), href: "#", current: false, disabled: true, children: [{ name: t('contacts:create:activities:zoom')},{ name: t('contacts:create:activities:call')}] },
  ];
  
  return (
    <>
      <div className="bg-white px-2 rounded-md w-full shadow-sm">
        <div className="bg-white">
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              {t('contacts:create:select')}
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
              <nav className="flex space-x-4 flex-wrap" aria-label="Tabs">
                {tabs.map((tab) => (
                  <>
                    {tab.children ? (
                      <div key={tab.name} className="py-4 -mt-[3px]">
                        <AppointmentMenu
                          options={tab.children}
                          label={tab.name}
                        />
                      </div>
                    ) : (
                      <a
                        key={tab.name}
                        href={tab.href}
                        className={clsx(
                          tab.current
                            ? "border-primary text-primary"
                            : "border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-700",
                          "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium uppercase"
                        )}
                        aria-current={tab.current ? "page" : undefined}
                      >
                        {tab.name}
                      </a>
                    )}
                  </>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="py-2">
          <input
            type="text"
            name="todo"
            id="todo"
            className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm bg-gray-200 placeholder:text-gray-400 outline-none focus:outline-none focus:border focus:border-primary sm:text-sm sm:leading-6"
            placeholder={t('contacts:create:activities:todo-tasks')}
          />
        </div>
      </div>

    </>
  );
}
