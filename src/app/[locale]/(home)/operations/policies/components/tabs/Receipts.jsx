"use client";
import {
  ChevronDownIcon,
  CheckIcon,
  Cog8ToothIcon,
} from "@heroicons/react/20/solid";
import ReceiptEmpty from "../ReceiptEmpty";
import { useTranslation } from "react-i18next";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatToDollars } from "@/src/utils/formatters";
import { useReceiptsByPolicyId } from "@/src/lib/api/hooks/receipts";
import { LoadingSpinnerSmall } from "@/src/components/LoaderSpinner";
import { formatDate } from "@/src/utils/getFormatDate";

export default function ReceiptsByPolicyId({ policyId, base = 0 }) {
  const { t } = useTranslation();
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const { data, isLoading } = useReceiptsByPolicyId(policyId);
  const [selectedPolizas, setSelectedPolizas] = useState([]);

  // useLayoutEffect(() => {
  //   if (checkbox.current) {
  //     const isIndeterminate =
  //       selectedPolizas &&
  //       selectedPolizas.length > 0 &&
  //       selectedPolizas.length < receipts.length;
  //     setChecked(selectedPolizas?.length === receipts?.length);
  //     setIndeterminate(isIndeterminate);
  //     checkbox.current.indeterminate = isIndeterminate;
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedPolizas]);

  // function toggleAll() {
  //   setSelectedPolizas(checked || indeterminate ? [] : receipts);
  //   setChecked(!checked && !indeterminate);
  //   setIndeterminate(false);
  // }

  if (isLoading) {
    return <LoadingSpinnerSmall />;
  }

  if (!data || data?.items?.length === 0) {
    return <ReceiptEmpty />;
  }

  return (
    <div className="h-full px-4 w-full">
      <div className="overflow-x-auto shadow-md rounded-xl">
        <table className="w-full rounded-md bg-gray-100 table-auto table">
          <thead className="text-sm bg-white drop-shadow-sm">
            <tr className="">
              <th
                scope="col"
                className="relative px-7 sm:w-12 sm:px-6 rounded-s-xl"
              >
                {/* <input
                  type="checkbox"
                  className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  ref={checkbox}
                  checked={checked}
                  onChange={toggleAll}
                /> */}
              </th>
              <th
                scope="col"
                className="py-3.5 pr-3  text-sm font-medium text-gray-400 cursor-pointer "
              >
                <div className="group items-center text-left">
                  # DE RECIBO
                  {/* <span
                    className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${
                      fieldClicked.field === "noPoliza" &&
                      fieldClicked.sortDirection === "desc"
                        ? "transform rotate-180"
                        : ""
                    }`}
                  >
                    <ChevronDownIcon className="h-6 w-6" aria-hidden="true" />
                  </span> */}
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer"
              >
                <div className="group inline-flex items-center">
                  STATUS
                  {/* <span
                    className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${
                      fieldClicked.field === "product" &&
                      fieldClicked.sortDirection === "desc"
                        ? "transform rotate-180"
                        : ""
                    }`}
                  >
                    <ChevronDownIcon className="h-6 w-6" aria-hidden="true" />
                  </span> */}
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer"
              >
                <div className="group inline-flex items-center">
                  FORMA DE PAGO
                  {/* <span
                    className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${
                      fieldClicked.field === "company" &&
                      fieldClicked.sortDirection === "desc"
                        ? "transform rotate-180"
                        : ""
                    }`}
                  >
                    <ChevronDownIcon
                      className="invisible ml-2 h-6 w-6 flex-none rounded text-primary group-hover:visible group-focus:visible"
                      aria-hidden="true"
                    />
                  </span> */}
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer"
              >
                <div className="group inline-flex items-center">
                  INICIO DE VIGENCIA
                  {/* <span
                    className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${
                      fieldClicked.field === "estadoPoliza" &&
                      fieldClicked.sortDirection === "desc"
                        ? "transform rotate-180"
                        : ""
                    }`}
                  >
                    <ChevronDownIcon
                      className="invisible ml-2 h-6 w-6 flex-none rounded text-primary group-hover:visible group-focus:visible"
                      aria-hidden="true"
                    />
                  </span> */}
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer"
              >
                <div className="group inline-flex items-center">
                  VENCIMIENTO
                  {/* <span
                    className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${
                      fieldClicked.field === "vigenciaDesde" &&
                      fieldClicked.sortDirection === "desc"
                        ? "transform rotate-180"
                        : ""
                    }`}
                  >
                    <ChevronDownIcon
                      className="invisible ml-2 h-6 w-6 flex-none rounded text-primary group-hover:visible group-focus:visible"
                      aria-hidden="true"
                    />
                  </span> */}
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer"
              >
                <div className="group inline-flex items-center">
                  IMPORTE
                  {/* <span
                    className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${
                      fieldClicked.field === "vigenciaHasta" &&
                      fieldClicked.sortDirection === "desc"
                        ? "transform rotate-180"
                        : ""
                    }`}
                  >
                    <ChevronDownIcon
                      className="invisible ml-2 h-6 w-6 flex-none rounded text-primary group-hover:visible group-focus:visible"
                      aria-hidden="true"
                    />
                  </span> */}
                </div>
              </th>
              <th
                scope="col"
                className={`px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer rounded-e-xl`}
              >
                <div className="group inline-flex items-center">
                  MONEDA
                  {/* <span
                    className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${
                      fieldClicked.field === "importePagar" &&
                      fieldClicked.sortDirection === "desc"
                        ? "transform rotate-180"
                        : ""
                    }`}
                  >
                    <ChevronDownIcon
                      className="invisible ml-2 h-6 w-6 flex-none rounded text-primary group-hover:visible group-focus:visible"
                      aria-hidden="true"
                    />
                  </span> */}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            {data &&
              data?.items?.length &&
              data?.items?.map((receipt, index) => (
                <tr key={index}>
                  <td className="relative px-7 sm:w-12 sm:px-6">
                    {selectedPolizas.includes(receipt) && (
                      <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                    )}
                    <input
                      type="checkbox"
                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:text-primary"
                      value={receipt.id}
                      checked={selectedPolizas.includes(receipt)}
                      onChange={(e) =>
                        setSelectedPolizas(
                          e.target.checked
                            ? [...selectedPolizas, receipt]
                            : selectedPolizas.filter((p) => p !== receipt)
                        )
                      }
                    />
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-black sm:pl-0 text-center cursor-pointer">
                    <Link
                      href={`/control/portafolio/receipts/receipt/${receipt.id}?show=true`}
                    >
                      <div className="flex gap-2 px-2 hover:text-primary">
                        {receipt.title}
                      </div>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
                    {receipt.status}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
                    {receipt?.methodCollection?.name ?? "S/N"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
                    {receipt?.metadata["Fecha de inicio"]}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-center">
                    {formatDate(receipt?.dueDate, "dd/MM/yyyy")}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-center">
                    {formatToDollars(receipt.paymentAmount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-center">
                    {receipt?.currency?.symbol ?? "S/N"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
