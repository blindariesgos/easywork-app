"use client";
import ReceiptEmpty from "../ReceiptEmpty";
import { useState } from "react";
import { formatToCurrency } from "@/src/utils/formatters";
import { useReceiptsByPolicyId } from "@/src/lib/api/hooks/receipts";
import { LoadingSpinnerSmall } from "@/src/components/LoaderSpinner";
import moment from "moment";
import { useRouter } from "next/navigation";
import clsx from "clsx";

export default function ReceiptsByPolicyId({ policyId, base = 0 }) {
  const { data, isLoading } = useReceiptsByPolicyId(policyId);
  const [selectedPolizas, setSelectedPolizas] = useState([]);
  const router = useRouter();

  const handleShowReceipt = (id) => {
    router.push(`/control/portafolio/receipts/receipt/${id}?show=true`);
  };

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
                    <div
                      className="flex gap-2 px-2 hover:text-primary"
                      onClick={() => handleShowReceipt(receipt.id)}
                    >
                      {receipt.title}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
                    <label
                      className={clsx(
                        "py-2 px-3 rounded-lg capitalize font-semibold cursor-pointer",
                        {
                          "bg-[#A9EA44]": receipt?.status == "pagado",
                          "bg-[#86BEDF]": receipt?.status == "vigente",
                          "bg-[#FFC4C2]": ["vencido", "cancelado"].includes(
                            receipt?.status
                          ),
                        }
                      )}
                    >
                      {receipt?.status}
                    </label>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
                    {receipt?.methodCollection?.name ?? "S/N"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-center">
                    {receipt?.dueDate
                      ? moment(receipt?.dueDate).utc().format("DD/MM/YYYY")
                      : "No disponible"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-center">
                    {formatToCurrency(receipt.paymentAmount ?? 0)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-center">
                    {receipt?.currency?.symbol ?? "No disponible"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
