"use client";
import TablePolicies from "./TablePolicies";
import { useEffect, useState } from "react";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useTranslation } from "react-i18next";
import { XCircleIcon } from "@heroicons/react/20/solid";
import usePolicyContext from "../../../../../../context/policies";

export default function Page({ searchParams }) {
  const { t } = useTranslation();
  const { setPage, isLoading, isError, data } = usePolicyContext();

  useEffect(() => {
    setPage(searchParams.page || 1);
  }, [searchParams.page]);

  if (isLoading) return <LoaderSpinner />;
  if (isError || !data)
    return (
      <div className="rounded-md bg-red-50 p-4 shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              {t("common:error-loading")}
            </h3>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flow-root relative h-full">
      <TablePolicies />
    </div>
  );
}
