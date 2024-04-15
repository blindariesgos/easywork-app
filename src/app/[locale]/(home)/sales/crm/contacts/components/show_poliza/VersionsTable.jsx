"use client";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import { useOrderByColumn } from "@/hooks/useOrderByColumn";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import PolizasEmpty from "../show_contact/tab_polizas/PolizasEmpty";

const people = [
  {
    attach: "archivo.doc",
    version: "0",
    renewal: "",
    dateStart: "10/10/2024",
    dateEnd: "10/10/2025",
  },
  {
    attach: "archivo.doc",
    version: "1",
    renewal: "",
    dateStart: "10/10/2024",
    dateEnd: "10/10/2025",
  },
  // More people...
];

export default function VersionsTable({ versions: data, base, noPolicy }) {
  const { t } = useTranslation();
  const { fieldClicked, handleSorting, orderItems } = useOrderByColumn(
    {},
    people
  );
  const [versions, setVersions] = useState(people);
  const pathname = usePathname();

  useEffect(() => {
    setVersions(orderItems);
  }, [orderItems]);

  if (!versions || versions.length === 0) {
    return <PolizasEmpty add />;
  }

  return (
    <div className="h-full relative">
      <div className="relative overflow-x-auto shadow-md rounded-xl">
        <table className="min-w-full rounded-md bg-gray-100">
          <thead className="text-sm bg-white drop-shadow-sm uppercase">
            <tr className="">
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-center text-sm font-medium text-gray-400 cursor-pointer rounded-s-xl"
                onClick={() => {
                  handleSorting("attach");
                }}
              >
                <div className="group inline-flex items-center">
                  {t("contacts:edit:policies:versions:table:attach")}
                  <span
                    className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${
                      fieldClicked.field === "attach" &&
                      fieldClicked.sortDirection === "desc"
                        ? "transform rotate-180"
                        : ""
                    }`}
                  >
                    <ChevronDownIcon className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer"
                onClick={() => {
                  handleSorting("version");
                }}
              >
                <div className="group inline-flex items-center">
                  {t("contacts:edit:policies:versions:table:version")}
                  <span
                    className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${
                      fieldClicked.field === "version" &&
                      fieldClicked.sortDirection === "desc"
                        ? "transform rotate-180"
                        : ""
                    }`}
                  >
                    <ChevronDownIcon className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer"
                onClick={() => {
                  handleSorting("renewal");
                }}
              >
                <div className="group inline-flex items-center">
                  {t("contacts:edit:policies:versions:table:renewal")}
                  <span
                    className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${
                      fieldClicked.field === "renewal" &&
                      fieldClicked.sortDirection === "desc"
                        ? "transform rotate-180"
                        : ""
                    }`}
                  >
                    <ChevronDownIcon
                      className="invisible ml-2 h-6 w-6 flex-none rounded text-primary group-hover:visible group-focus:visible"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer"
                onClick={() => {
                  handleSorting("dateStart");
                }}
              >
                <div className="group inline-flex items-center">
                  {t("contacts:edit:policies:versions:table:date-init")}
                  <span
                    className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${
                      fieldClicked.field === "dateStart" &&
                      fieldClicked.sortDirection === "desc"
                        ? "transform rotate-180"
                        : ""
                    }`}
                  >
                    <ChevronDownIcon
                      className="invisible ml-2 h-6 w-6 flex-none rounded text-primary group-hover:visible group-focus:visible"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer"
                onClick={() => {
                  handleSorting("dateEnd");
                }}
              >
                <div className="group inline-flex items-center">
                  {t("contacts:edit:policies:versions:table:date-end")}
                  <span
                    className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${
                      fieldClicked.field === "dateEnd" &&
                      fieldClicked.sortDirection === "desc"
                        ? "transform rotate-180"
                        : ""
                    }`}
                  >
                    <ChevronDownIcon
                      className="invisible ml-2 h-6 w-6 flex-none rounded text-primary group-hover:visible group-focus:visible"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            {versions.map((poliza, index) => (
              <tr key={index}>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-center">
                  <div className="flex gap-2 px-2 hover:text-primary">
                    <DocumentTextIcon
                      className="h-5 w-5 text-primary"
                      aria-hidden="true"
                    />
                    {poliza.attach}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
                  {poliza.version}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
                  {poliza.renewal}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
                  {poliza.dateStart}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-center">
                  {poliza.dateEnd}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
