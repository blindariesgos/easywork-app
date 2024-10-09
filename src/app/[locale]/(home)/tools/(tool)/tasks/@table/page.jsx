"use client";
import React, { useEffect, useState } from "react";
import TableTask from "./TableTask";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import useTasksContext from "../../../../../../../context/tasks"

export default function Page({ searchParams }) {
  const { t } = useTranslation();
  const { tasks, isLoading, isError, setPage, setLimit } = useTasksContext()

  useEffect(() => {
    setPage(searchParams.page || 1);
  }, [searchParams.page]);

  useEffect(() => {
    setLimit(searchParams.limit || 15);
  }, [searchParams.limit]);


  if (isLoading) return <LoaderSpinner />;
  if (isError || !tasks)
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
    <div className="relative h-full">
      <TableTask />
    </div>
  );
}
