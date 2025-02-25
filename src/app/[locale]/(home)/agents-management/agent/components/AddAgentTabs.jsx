"use client";
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
import IconDropdown from "@/src/components/SettingsButton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tab, TabList } from "@headlessui/react";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import AddDocuments from "./AddDocuments";
import { MdPlayCircleFilled } from "react-icons/md";
export default function AddContactTabs({ tabs, refPrint, agent, type }) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace, push } = useRouter();
  const handlePrint = useReactToPrint({
    documentTitle: `Detalle_agente_${agent?.fullName?.split(" ")?.join("_") ?? ""}_${moment().format("DDMMyyyyHHmmss")}`,
    contentRef: refPrint,
  });

  const settings = [
    ...(() => {
      return type == "accompaniment"
        ? [
            {
              value: 0,
              name: "Iniciar Proceso",
              icon: MdPlayCircleFilled,
              options: [
                {
                  name: "Iniciar Reclutamiento",
                  onClick: () =>
                    push(
                      `/agents-management/recruitment/agent/${agent.id}?show=true&edit=true`
                    ),
                },
                {
                  name: "Iniciar Conexion",
                  onClick: () =>
                    push(
                      `/agents-management/conections/agent/${agent.id}?show=true&edit=true`
                    ),
                },
              ],
            },
          ]
        : [];
    })(),
    {
      value: 0,
      name: t("contacts:create:print"),
      onClick: handlePrint,
      icon: DocumentTextIcon,
    },
  ];

  const renderTab = (item) => (
    <Tab
      className={clsx(
        "data-[selected]:border-indigo-500 data-[selected]:text-white data-[selected]:bg-blue-100 data-[selected]:rounded-md data-[selected]:focus:outline-none data-[selected]:focus:ring-0",
        "data-[disabled]:border-transparent data-[disabled]:text-gray-300 data-[disabled]:cursor-default",
        "border-transparent text-gray-400",
        "whitespace-nowrap py-2 px-3 text-sm font-medium cursor-pointer focus:outline-none focus:ring-0"
      )}
      aria-current={item.current ? "page" : undefined}
      onClick={() => {
        if (!item.module) return;
        params.set("tab", item.module);
        replace(`${pathname}?${params.toString()}`);
      }}
      key={item.name}
      disabled={item.disabled}
    >
      {item.name}
    </Tab>
  );

  return (
    <div className="bg-white px-4 w-full rounded-lg">
      <div className="flex justify-between items-center">
        <TabList className="flex gap-x-2 gap-y-2 py-2 flex-wrap justify-start">
          {tabs
            .filter((tab) => !tab.hidden)
            .map((tab) => {
              if (tab.link) {
                return (
                  <Link
                    key={tab.name}
                    href={tab.link || ""}
                    disabled={tab.disabled}
                    className="ring-0 focus:outline-none focus:ring-0"
                  >
                    {renderTab(tab)}
                  </Link>
                );
              }

              return renderTab(tab);
            })}
          {/* <Button
            label={t("leads:add:title")}
            buttonStyle="primary"
            icon={<PlusIcon className="h-4 w-4 text-white" />}
            className="py-2 px-3"
          /> */}
          <AddDocuments crmId={agent.id} type={type} />
        </TabList>
        <IconDropdown
          icon={<Cog8ToothIcon className="h-8 w-8 text-primary" />}
          options={settings}
          width="w-44"
        />
      </div>
    </div>
  );
}
