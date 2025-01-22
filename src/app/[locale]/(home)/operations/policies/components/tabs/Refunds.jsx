"use client";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import PolizasEmpty from "../ReceiptEmpty";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import LoaderSpinner from "@/src/components/LoaderSpinner";
import moment from "moment";
import FooterTable from "@/src/components/FooterTable";
import { useRouter } from "next/navigation";
import { formatToCurrency } from "@/src/utils/formatters";
import { usePolicies } from "@/src/lib/api/hooks/policies";
import { useRefunds } from "@/src/lib/api/hooks/refunds";
import { polizaReimbursementStatus } from "@/src/utils/stages";

export default function Refunds({ polizaId }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [fieldClicked, setFieldClicked] = useState({
    orderBy: "poliza",
    order: "DESC",
  });
  const { data, isLoading } = useRefunds({
    filters: {
      polizaId,
    },
    config: {
      ...fieldClicked,
      page,
      limit,
    },
  });
  const { t } = useTranslation();

  const router = useRouter();

  const handleSorting = (fieldToSort) => {
    if (fieldClicked.order === "ASC") {
      setFieldClicked({ orderBy: fieldToSort, order: "DESC" });
    } else {
      setFieldClicked({ orderBy: fieldToSort, order: "ASC" });
    }
  };

  const handleShowRefund = (refund) => {
    router.push(`/operations/refunds/refund/${refund.id}?show=true`);
  };

  if ((!data || data?.items?.length === 0) && !isLoading) {
    return <PolizasEmpty type="Reembolsos registrados" />;
  }

  return (
    <div className="h-full relative px-4">
      {isLoading && <LoaderSpinner />}
      <div className="relative overflow-x-auto shadow-md rounded-xl">
        <table className="min-w-full rounded-md bg-gray-100 table-auto">
          <thead className="text-sm bg-white drop-shadow-sm">
            <tr className="">
              <th
                scope="col"
                className="py-3.5 pr-3 text-sm font-medium text-gray-400 cursor-pointer "
              >
                <div className="group flex items-center pl-4">
                  <p>OT</p>
                </div>
              </th>
              <th
                scope="col"
                className=" py-3.5 text-sm font-medium text-gray-400 cursor-pointer"
              >
                <div className="group flex items-center">
                  <p>SIGRE</p>
                </div>
              </th>
              <th
                scope="col"
                className=" py-3.5 text-sm font-medium text-gray-400 cursor-pointer"
              >
                <div className="group flex items-center">
                  <p># Folio</p>
                </div>
              </th>
              <th
                scope="col"
                className=" py-3.5 text-sm font-medium text-gray-400 cursor-pointer"
              >
                <div className="group flex items-center">
                  <p>Estado</p>
                </div>
              </th>
              <th
                scope="col"
                className="py-3.5 text-sm font-medium text-gray-400 cursor-pointer rounded-e-xl"
              >
                <div className="group flex items-center">
                  <p>Fecha de inicio</p>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            {data &&
              data?.items &&
              data?.items?.length &&
              data?.items?.map((refund, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap py-4 pr-3 text-sm font-semibold text-black sm:pl-0 text-center cursor-pointer">
                    <div
                      className="flex gap-2 hover:text-primary pl-4 cursor-pointer"
                      onClick={() => handleShowRefund(refund)}
                    >
                      <p>{refund?.ot}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap  py-4 text-sm text-gray-400 uppercase">
                    <p>{refund?.sigre}</p>
                  </td>
                  <td className="whitespace-nowrap  py-4 text-sm text-gray-400 uppercase">
                    {refund?.folioNumber}
                  </td>
                  <td className="whitespace-nowrap  py-4 text-sm text-gray-400 uppercase">
                    <p>
                      {refund?.status
                        ? polizaReimbursementStatus[refund?.status]
                        : polizaReimbursementStatus.captura_documentos}
                    </p>
                  </td>
                  <td className="whitespace-nowrap py-4 text-sm text-gray-400">
                    <p>
                      {moment(refund?.startDate ?? refund?.createdAt).format(
                        "DD/MM/YYYY"
                      )}
                    </p>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {data?.meta?.totalItems > 10 && (
        <div className="pt-4">
          <FooterTable
            limit={limit}
            setLimit={setLimit}
            page={page}
            setPage={setPage}
            totalPages={data?.meta?.totalPages}
            total={data?.meta?.totalItems ?? 0}
          />
        </div>
      )}
    </div>
  );
}
