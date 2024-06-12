import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";
import AppointmentMenu from "./AppointmentMenu";

export default function ActivityHeader() {
  const { t } = useTranslation();
  const tabs = [
    { name: t('contacts:create:activities:email'), href: "/tools/mails", current: true, disabled: false },
    { name: t('contacts:create:activities:tasks'), href: "#", current: false, disabled: true },
    { name: t('contacts:create:activities:whatsapp'), href: "#", current: false, disabled: true },
    { name: t('contacts:create:activities:comment'), href: "#", current: false, disabled: true },
    { name: t('contacts:create:activities:appointments'), href: "#", current: false, disabled: true, menu: true, children: [{ name: t('contacts:create:activities:zoom')},{ name: t('contacts:create:activities:call')}] },
  ];
  const settings = [
    {
      value: 0,
      name: t("contacts:header:settings:vcard"),
      onclick: () => {},
    },
    {
      value: 1,
      name: t("contacts:header:settings:gmail"),
      onclick: () => {},
    },
    {
      value: 2,
      name: t("contacts:header:settings:outlook"),
      onclick: () => {},
    },
    {
      value: 3,
      name: t("contacts:header:settings:yahoo"),
      onclick: () => {},
    },
    {
      value: 4,
      name: t("contacts:header:settings:import"),
      onclick: () => {},
    },
    {
      value: 5,
      name: t("contacts:header:settings:crm"),
      onclick: () => {},
    },
    {
      value: 6,
      name: t("contacts:header:settings:csv"),
      onclick: () => {},
    },
    {
      value: 7,
      name: t("contacts:header:settings:excel"),
      onclick: () => {},
    },
    {
      value: 8,
      name: t("contacts:header:settings:export"),
      onclick: () => {},
    },
    {
      value: 9,
      name: t("contacts:header:settings:control"),
      onclick: () => {},
    },
    {
      value: 10,
      name: t("contacts:header:settings:search"),
      onclick: () => {},
    },
    {
      value: 11,
      name: t("contacts:header:settings:entity"),
      onclick: () => {},
    },
  ]
  return (
    <>
      <div className="bg-white px-2 md:px-4 rounded-lg w-full shadow-sm">
        <div className="bg-white">
          <div className="">
            <div className=" mt-4">
              <nav className="flex space-x-4 flex-wrap pt-4" aria-label="Tabs">
                {tabs.map((tab) => (
                  <div key={tab.name}>
                    {tab.children ? (
                      <div key={tab.name} className="py-4 -mt-4">
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
                            ? " text-gray-400"
                            : "border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-700",
                          "whitespace-nowrap py-2 px-1 text-sm font-medium uppercase"
                        )}
                        aria-current={tab.current ? "page" : undefined}
                      >
                        {tab.name}
                      </a>
                    )}
                  </div>
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
