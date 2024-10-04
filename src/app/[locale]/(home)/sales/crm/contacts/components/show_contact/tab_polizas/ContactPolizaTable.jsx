"use client";
import {
  ChevronDownIcon,
  CheckIcon,
  Cog8ToothIcon,
} from "@heroicons/react/20/solid";
import PolizasEmpty from "./PolizasEmpty";
import { useTranslation } from "react-i18next";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePoliciesByContactId } from "../../../../../../../../../lib/api/hooks/policies";
import { formatToCurrency } from "@/src/utils/formatters";

export default function ContactPolizaTable({ base, contactId }) {
  const [fieldClicked, setFieldClicked] = useState({
    orderBy: "poliza",
    order: "DESC",
  });
  const { policies } = usePoliciesByContactId({ contactId, ...fieldClicked });
  const { t } = useTranslation();
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPolizas, setSelectedPolizas] = useState([]);

  const handleSorting = (fieldToSort) => {
    if (fieldClicked.order === "ASC") {
      setFieldClicked({ orderBy: fieldToSort, order: "DESC" });
    } else {
      setFieldClicked({ orderBy: fieldToSort, order: "ASC" });
    }
  };

  useLayoutEffect(() => {
    if (checkbox.current) {
      const isIndeterminate =
        selectedPolizas &&
        selectedPolizas.length > 0 &&
        selectedPolizas.length < policies?.items?.length;
      setChecked(selectedPolizas?.length === policies?.items?.length);
      setIndeterminate(isIndeterminate);
      checkbox.current.indeterminate = isIndeterminate;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPolizas]);

  function toggleAll() {
    setSelectedPolizas(checked || indeterminate ? [] : policies.items);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  useEffect(() => {
    console.log({ policies });
  }, [policies]);

  if (!policies || policies?.length === 0) {
    return <PolizasEmpty />;
  }

  return (
    <div className="h-full relative">
      <div className="relative overflow-x-auto shadow-md rounded-xl">
        <table className="min-w-full rounded-md bg-gray-100 table-auto">
          <thead className="text-sm bg-white drop-shadow-sm">
            <tr className="">
              <th
                scope="col"
                className="relative px-7 sm:w-12 sm:px-6 rounded-s-xl"
              >
                <input
                  type="checkbox"
                  className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  ref={checkbox}
                  checked={checked}
                  onChange={toggleAll}
                />
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-center text-sm font-medium text-gray-400 cursor-pointer "
                onClick={() => {
                  handleSorting("noPoliza");
                }}
              >
                <div className="group inline-flex items-center">
                  {t("polizas:edit:policies:table:policy")}
                  <span
                    className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${
                      fieldClicked.orderBy === "poliza" &&
                      fieldClicked.order === "DESC"
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
                  handleSorting("product");
                }}
              >
                <div className="group inline-flex items-center">
                  {t("polizas:edit:policies:table:product")}
                  <span
                    className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${
                      fieldClicked.orderBy === "product" &&
                      fieldClicked.order === "DESC"
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
                  handleSorting("company");
                }}
              >
                <div className="group inline-flex items-center">
                  {t("polizas:edit:policies:table:company")}
                  <span
                    className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${
                      fieldClicked.orderBy === "company" &&
                      fieldClicked.order === "DESC"
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
                  handleSorting("estadoPoliza");
                }}
              >
                <div className="group inline-flex items-center">
                  {t("polizas:edit:policies:table:status")}
                  <span
                    className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${
                      fieldClicked.orderBy === "estadoPoliza" &&
                      fieldClicked.order === "DESC"
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
                  handleSorting("vigenciaDesde");
                }}
              >
                <div className="group inline-flex items-center">
                  {t("polizas:edit:policies:table:start")}
                  <span
                    className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${
                      fieldClicked.orderBy === "vigenciaDesde" &&
                      fieldClicked.order === "DESC"
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
                  handleSorting("vigenciaHasta");
                }}
              >
                <div className="group inline-flex items-center">
                  {t("polizas:edit:policies:table:expiration")}
                  <span
                    className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${
                      fieldClicked.orderBy === "vigenciaHasta" &&
                      fieldClicked.order === "DESC"
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
                className={`px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer ${
                  base > 0 && "rounded-e-xl"
                }`}
                onClick={() => {
                  handleSorting("importePagar");
                }}
              >
                <div className="group inline-flex items-center">
                  {t("polizas:edit:policies:table:amount")}
                  <span
                    className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${
                      fieldClicked.orderBy === "importePagar" &&
                      fieldClicked.order === "DESC"
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
              {base === 0 && (
                <th
                  scope="col"
                  className="px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer rounded-e-xl"
                  onClick={() => {
                    handleSorting("ramo");
                  }}
                >
                  <div className="group inline-flex items-center">
                    {t("polizas:edit:policies:table:branch")}
                    <span
                      className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${
                        fieldClicked.orderBy === "ramo" &&
                        fieldClicked.order === "DESC"
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
              )}
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            {policies &&
              policies?.map((poliza, index) => (
                <tr key={index}>
                  <td className="relative px-7 sm:w-12 sm:px-6">
                    {selectedPolizas.includes(poliza) && (
                      <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                    )}
                    <input
                      type="checkbox"
                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:text-primary"
                      value={poliza.id}
                      checked={selectedPolizas.includes(poliza)}
                      onChange={(e) =>
                        setSelectedPolizas(
                          e.target.checked
                            ? [...selectedPolizas, poliza]
                            : selectedPolizas.filter((p) => p !== poliza)
                        )
                      }
                    />
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-black sm:pl-0 text-center cursor-pointer">
                    <Link
                      href={`/operations/policies/policy/${poliza.id}?show=true`}
                    >
                      <div className="flex gap-2 px-2 hover:text-primary">
                        {poliza.poliza}
                      </div>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
                    {poliza?.category?.name ?? "S/N"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
                    {poliza?.company?.name ?? "S/N"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
                    {poliza?.status ?? "S/N"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-center">
                    {poliza?.vigenciaDesde}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-center">
                    {poliza?.vigenciaHasta}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-center">
                    {formatToCurrency(poliza.importePagar)}
                  </td>
                  {base === 0 && (
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-center">
                      {poliza?.type?.name || "S/N"}
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
