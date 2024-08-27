"use client";
import Button from "../../../../../../../../components/form/Button";
import useAppContext from "../../../../../../../../context/app";
import {
  ArrowDownTrayIcon,
  Cog8ToothIcon,
  DocumentTextIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import IconDropdown from "../../../../../../../../components/SettingsButton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tab, TabList } from "@headlessui/react";

export default function AddContactTabs() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();
  const tabs = [
    { name: t("contacts:create:tabs:general"), value: 0, module: "general" },
    {
      name: t("contacts:create:tabs:policies"),
      value: 1,
      module: "policies",
    },
    // { name: t("contacts:create:tabs:activities"), value: 2 },
    // { name: t("contacts:create:tabs:reports"), value: 3 },
    {
      name: t("contacts:create:tabs:documents"),
      value: 4,
      module: "documents",
    },
  ];

  const settings = [
    {
      value: 0,
      name: t("contacts:create:download"),
      onclick: () => {},
      icon: ArrowDownTrayIcon,
    },
    {
      value: 0,
      name: t("contacts:create:print"),
      onclick: () => {},
      icon: DocumentTextIcon,
    },
  ];

  const renderTab = (item) => (
    <Tab
      className={clsx(
        "data-[selected]:border-indigo-500 data-[selected]:text-white data-[selected]:bg-blue-100 data-[selected]:rounded-md data-[selected]:focus:outline-none data-[selected]:focus:ring-0",
        "data-[disabled]:border-transparent data-[disabled]:text-gray-300 data-[disabled]:cursor-default",
        "border-transparent text-gray-400",
        "whitespace-nowrap p-2 text-sm font-medium cursor-pointer focus:outline-none focus:ring-0"
      )}
      aria-current={item.current ? "page" : undefined}
      onClick={() => {
        if (!item.module) return;
        params.set("tab", item.module);
        replace(`${pathname}?${params.toString()}`);
      }}
      key={item.name}
    >
      {item.name}
    </Tab>
  );

  return (
    <div className="bg-white px-4 w-full rounded-lg">
      <div className="flex justify-between items-center">
        <TabList
          className=" flex gap-x-4 lg:gap-x-8 gap-y-2 p-2 flex-wrap justify-start"
          aria-label="Tabs"
        >
          {tabs.map((tab) => {
            if (tab.link) {
              return (
                <Link
                  key={tab.name}
                  href={tab.link || ""}
                  className="ring-0 focus:outline-none focus:ring-0"
                >
                  {renderTab(tab)}
                </Link>
              );
            }

            return renderTab(tab);
          })}
          <Button
            label={t("contacts:create:add")}
            buttonStyle="primary"
            icon={<PlusIcon className="h-4 w-4 text-white" />}
            className="py-2 px-3"
          />
        </TabList>
        <IconDropdown
          icon={
            <Cog8ToothIcon
              className="h-8 w-8 text-primary"
              aria-hidden="true"
            />
          }
          options={settings}
          width="w-44"
        />
      </div>
    </div>
  );
}
