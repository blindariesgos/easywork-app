"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ControlContext } from "..";
import { usePortfolioControl } from "../../lib/api/hooks/policies";
import { useTasksConfigs } from "@/src/hooks/useCommon";
import { useTranslation } from "react-i18next";
import useAppContext from "../app";
import { useSession } from "next-auth/react";
import { getAddListContacts, getPortafolioControlResume } from "@/src/lib/apis";

export default function ControlContextProvider({ children }) {
  const session = useSession();
  const { t } = useTranslation();
  const { lists } = useAppContext();
  const [filters, setFilters] = useState({});
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [groupKey, setGroupKey] = useState("urgente_30");
  const { data, isLoading, isError, mutate } = usePortfolioControl({
    filters,
    config: {
      page,
      limit,
    },
    groupKey,
  });
  const [displayFilters, setDisplayFilters] = useState({});
  const [filterFields, setFilterFields] = useState();

  useEffect(() => {
    if (!lists?.users) return;
    setFilterFields([
      {
        id: 1,
        name: t("control:portafolio:control:form:agent"),
        options: lists?.users,
        type: "select",
        check: true,
        code: "responsibleId",
      },
      {
        id: 2,
        name: t("control:portafolio:control:form:currency"),
        type: "select",
        check: false,
        code: "currencyId",
        options: [
          {
            name: "Todas las monedas",
            value: "",
            id: 1,
          },
          ...lists?.receipts?.currencies,
        ],
      },
    ]);

    setFilters({
      responsibleId: lists?.users[0]?.id,
      currencyId: "",
    });
    setDisplayFilters([
      {
        id: 1,
        name: t("control:portafolio:control:form:agent"),
        options: lists?.users,
        type: "select",
        value: lists?.users[0]?.id,
        code: "responsibleId",
      },
      {
        id: 2,
        name: t("control:portafolio:control:form:currency"),
        code: "currencyId",
        type: "select",
        options: [
          {
            name: "Todas las monedas",
            value: "ALL",
            id: "",
          },
          ...lists?.receipts?.currencies,
        ],
        value: "",
      },
    ]);
  }, [lists]);

  useEffect(() => {
    console.log({ lists });
  }, [lists?.receipts]);

  useEffect(() => {
    if (Object.keys(filters).length == 0 && filterFields) {
      setFilterFields(
        filterFields?.map((field) => ({
          ...field,
          check: field.code === "role",
        }))
      );
    }
  }, [filters]);

  useEffect(() => {
    setPage(1);
  }, [limit]);

  const getTotalsByState = async () => {
    const response = await getPortafolioControlResume().catch((error) => error);
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaa", response);
  };

  useEffect(() => {
    getTotalsByState();
  }, []);

  const removeFilter = (filterName) => {
    const newFilters = Object.keys(filters)
      .filter((key) => key !== filterName)
      .reduce((acc, key) => ({ ...acc, [key]: filters[key] }), {});

    setFilters(newFilters);
    setDisplayFilters(
      displayFilters.filter((filter) => filter.code !== filterName)
    );
    const newFilterFields = filterFields.map((field) => {
      return filterName !== field.code ? field : { ...field, check: false };
    });
    setFilterFields(newFilterFields);
  };

  const values = useMemo(
    () => ({
      selectedTasks,
      setSelectedTasks,
      data,
      isLoading,
      isError,
      page,
      setPage,
      limit,
      setLimit,
      mutate,
      filters,
      setFilters,
      filterFields,
      setFilterFields,
      displayFilters,
      setDisplayFilters,
      removeFilter,
      setGroupKey,
    }),
    [
      selectedTasks,
      data,
      isLoading,
      isError,
      mutate,
      page,
      limit,
      filters,
      filterFields,
      displayFilters,
    ]
  );

  return (
    <ControlContext.Provider value={values}>{children}</ControlContext.Provider>
  );
}
