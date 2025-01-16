"use client";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import PolizasEmpty from "./PolizasEmpty";
import { useTranslation } from "react-i18next";
import { useLayoutEffect, useRef, useState } from "react";
import { usePoliciesByContactId } from "../../../../../../../../../lib/api/hooks/policies";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import moment from "moment";
import FooterTable from "@/src/components/FooterTable";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatToCurrency } from "@/src/utils/formatters";

export default function ContactPolizaTable({ base = 0, contactId }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [fieldClicked, setFieldClicked] = useState({
    orderBy: "poliza",
    order: "DESC",
  });
  const { data, isLoading } = usePoliciesByContactId({
    contactId,
    config: {
      ...fieldClicked,
      page,
      limit,
    },
  });
  const { t } = useTranslation();
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPolizas, setSelectedPolizas] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSorting = (fieldToSort) => {
    if (fieldClicked.order === "ASC") {
      setFieldClicked({ orderBy: fieldToSort, order: "DESC" });
    } else {
      setFieldClicked({ orderBy: fieldToSort, order: "ASC" });
    }
  };

  const handleShowPolicy = (poliza) => {
    if (!poliza.operacion || poliza.operacion == "produccion_nueva") {
      // const params = new URLSearchParams(searchParams);
      // params.set("show", true);
      // params.set("policy", poliza.id);
      // router.replace(`${pathname}?${params.toString()}`);
      router.push(`/operations/policies/policy/${poliza.id}?show=true`);
      return;
    }
    if (poliza.operacion == "renovacion") {
      router.push(`/operations/renovations/renovation/${poliza.id}?show=true`);
    }
  };

  useLayoutEffect(() => {
    if (checkbox.current) {
      const isIndeterminate =
        selectedPolizas &&
        selectedPolizas.length > 0 &&
        selectedPolizas.length < data?.items?.length;
      setChecked(selectedPolizas?.length === data?.items?.length);
      setIndeterminate(isIndeterminate);
      checkbox.current.indeterminate = isIndeterminate;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPolizas]);

  if ((!data || data?.items?.length === 0) && !isLoading) {
    return <PolizasEmpty />;
  }

  return (
    <div className="h-full relative">
      {isLoading && <LoaderSpinner />}
      <div className="relative overflow-x-auto shadow-md rounded-xl">
        <table className="min-w-full rounded-md bg-gray-100 table-auto">
          <thead className="text-sm bg-white drop-shadow-sm">
            <tr className="">
              {/* <th
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
              </th> */}
              <th
                scope="col"
                className="py-3.5 pr-3 text-sm font-medium text-gray-400 cursor-pointer "
                onClick={() => {
                  handleSorting("noPoliza");
                }}
              >
                <div className="group flex items-center pl-4">
                  <p>{t("polizas:edit:policies:table:policy")}</p>
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
                className=" py-3.5 text-sm font-medium text-gray-400 cursor-pointer"
                onClick={() => {
                  handleSorting("product");
                }}
              >
                <div className="group flex items-center">
                  <p>{t("polizas:edit:policies:table:product")}</p>
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
                className="py-3.5 text-sm font-medium text-gray-400 cursor-pointer"
                onClick={() => {
                  handleSorting("company");
                }}
              >
                <div className="group flex items-center">
                  <p>{t("polizas:edit:policies:table:company")}</p>
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
                className="py-3.5 text-sm font-medium text-gray-400 cursor-pointer"
                onClick={() => {
                  handleSorting("estadoPoliza");
                }}
              >
                <div className="group flex items-center">
                  <p>{t("polizas:edit:policies:table:status")}</p>
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
                className="py-3.5 text-sm font-medium text-gray-400 cursor-pointer"
                onClick={() => {
                  handleSorting("vigenciaDesde");
                }}
              >
                <div className="group flex items-center">
                  <p>{t("polizas:edit:policies:table:start")}</p>
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
                className="py-3.5 text-sm font-medium text-gray-400 cursor-pointer"
                onClick={() => {
                  handleSorting("vigenciaHasta");
                }}
              >
                <div className="group flex items-center">
                  <p>{t("polizas:edit:policies:table:expiration")}</p>
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
                className={`py-3.5 text-sm font-medium text-gray-400 cursor-pointer ${
                  base > 0 && "rounded-e-xl"
                }`}
                onClick={() => {
                  handleSorting("importePagar");
                }}
              >
                <div className="group flex items-center">
                  <p>{t("polizas:edit:policies:table:amount")}</p>
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
              <th
                scope="col"
                className="py-3.5 text-sm font-medium text-gray-400 cursor-pointer"
                onClick={() => {
                  handleSorting("ramo");
                }}
              >
                <div className="group flex items-center">
                  <p>{t("polizas:edit:policies:table:branch")}</p>
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
              <th
                scope="col"
                className="py-3.5 text-sm font-medium text-gray-400 cursor-pointer rounded-e-xl"
              >
                <div className="group flex items-center">
                  <p>Tipo</p>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            {data &&
              data?.items &&
              data?.items?.length &&
              data?.items?.map((poliza, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap py-4 pr-3 text-sm font-semibold text-black sm:pl-0 text-center cursor-pointer">
                    <div
                      className="flex gap-2 hover:text-primary pl-4 cursor-pointer"
                      onClick={() => handleShowPolicy(poliza)}
                    >
                      {poliza.poliza}
                    </div>
                  </td>
                  <td className="whitespace-nowrap  py-4 text-sm text-gray-400 uppercase">
                    <p>{poliza?.category?.name ?? "S/N"}</p>
                  </td>
                  <td className="whitespace-nowrap  py-4 text-sm text-gray-400 uppercase">
                    <p>{poliza?.company?.name ?? "S/N"}</p>
                  </td>
                  <td className="whitespace-nowrap  py-4 text-sm text-gray-400 uppercase">
                    <p>{poliza?.status ?? "S/N"}</p>
                  </td>
                  <td className="whitespace-nowrap py-4 text-sm text-gray-400">
                    <p>
                      {moment(poliza?.vigenciaDesde).utc().format("DD/MM/yyyy")}
                    </p>
                  </td>
                  <td className="whitespace-nowrap py-4 text-sm text-gray-400">
                    <p>
                      {moment(poliza?.vigenciaHasta).utc().format("DD/MM/yyyy")}
                    </p>
                  </td>
                  <td className="whitespace-nowrap py-4 text-sm text-gray-400">
                    <p>{`${poliza?.currency?.symbol ?? "$"} ${poliza?.importePagar ? formatToCurrency(poliza?.importePagar) : "0.00"}`}</p>
                  </td>
                  <td className="whitespace-nowrap py-4 text-sm text-gray-400">
                    <p>{poliza?.type?.name || "S/N"}</p>
                  </td>
                  <td className="whitespace-nowrap py-4 text-sm text-gray-400">
                    <p>
                      {poliza?.operacion == "cambio_version"
                        ? `Versión - ${poliza.version}`
                        : poliza?.operacion == "renovacion"
                          ? `Renovación - ${poliza.version ?? poliza.renovacion}`
                          : "Póliza"}
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
