"use client";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import PolizasEmpty from "../ReceiptEmpty";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import LoaderSpinner from "@/src/components/LoaderSpinner";
import moment from "moment";
import FooterTable from "@/src/components/FooterTable";
import { useRouter } from "next/navigation";
import { polizaReimbursementStatus } from "@/src/utils/constants";
import { useSchedules } from "@/src/lib/api/hooks/schedules";

export default function Schedules({ polizaId }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [fieldClicked, setFieldClicked] = useState({
    orderBy: "poliza",
    order: "DESC",
  });
  const { data, isLoading } = useSchedules({
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

  const handleShowSchedule = (schedule) => {
    router.push(
      `/operations/programations/programation/${schedule.id}?show=true`
    );
  };

  if ((!data || data?.items?.length === 0) && !isLoading) {
    return <PolizasEmpty type="Programaciones registradas" />;
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
              data?.items?.map((schedule, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap py-4 pr-3 text-sm font-semibold text-black sm:pl-0 text-center cursor-pointer">
                    <div
                      className="flex gap-2 hover:text-primary pl-4 cursor-pointer"
                      onClick={() => handleShowSchedule(schedule)}
                    >
                      <p>{schedule?.ot}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap  py-4 text-sm text-gray-400 uppercase">
                    <p>{schedule?.sigre}</p>
                  </td>
                  <td className="whitespace-nowrap  py-4 text-sm text-gray-400 uppercase">
                    {schedule?.folioNumber}
                  </td>
                  <td className="whitespace-nowrap  py-4 text-sm text-gray-400 uppercase">
                    <p>
                      {schedule?.status
                        ? polizaReimbursementStatus[schedule?.status]
                        : polizaReimbursementStatus.captura_documentos}
                    </p>
                  </td>
                  <td className="whitespace-nowrap py-4 text-sm text-gray-400">
                    <p>
                      {moment(
                        schedule?.startDate ?? schedule?.createdAt
                      ).format("DD/MM/YYYY")}
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
