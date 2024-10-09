"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ControlContext } from "..";
import { useTasks } from "../../lib/api/hooks/tasks";
import { useTasksConfigs } from "@/src/hooks/useCommon";
import { useTranslation } from "react-i18next";
import useAppContext from "../app";
import { useSession } from "next-auth/react";

export default function ControlContextProvider({ children }) {
  const session = useSession()
  const { t } = useTranslation()
  const { lists } = useAppContext();
  const [filters, setFilters] = useState({})
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const { tasks, isLoading, isError, mutate } = useTasks({ page, limit, filters, userId: session?.data?.user?.id });
  const [displayFilters, setDisplayFilters] = useState({})
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
        code: "user",
      },
      {
        id: 2,
        name: t("control:portafolio:control:form:currency"),
        type: "select",
        check: false,
        code: "currency",
        options: [
          {
            name: "Todas las monedas",
            value: "ALL",
            id: 1
          },
          {
            name: "Peso",
            value: "PESO",
            id: 2
          },
          {
            name: "Dolar",
            value: "DOLLAR",
            id: 3
          }
        ]
      },
    ])

    setFilters({
      user: lists?.users[0]?.id,
      currency: "ALL"
    })
    setDisplayFilters([
      {
        id: 1,
        name: t("control:portafolio:control:form:agent"),
        options: lists?.users,
        type: "select",
        value: lists?.users[0]?.id
      },
      {
        id: 2,
        name: t("control:portafolio:control:form:currency"),
        code: "currency",
        type: "select",
        options: [
          {
            name: "Todas las monedas",
            value: "ALL",
            id: 1
          },
          {
            name: "Peso",
            value: "PESO",
            id: 2
          },
          {
            name: "Dolar",
            value: "DOLLAR",
            id: 3
          }
        ],
        value: 1
      }])
  }, [lists?.users])

  useEffect(() => {
    if (Object.keys(filters).length == 0 && filterFields) {
      setFilterFields(filterFields?.map(field => ({
        ...field,
        check: field.code === "role"
      })))
    }
  }, [filters])

  useEffect(() => {
    setPage(1)
  }, [limit])

  const removeFilter = (filterName) => {
    const newFilters = Object.keys(filters)
      .filter((key) => key !== filterName)
      .reduce((acc, key) => ({ ...acc, [key]: filters[key] }), {})

    setFilters(newFilters)
    setDisplayFilters(displayFilters.filter(filter => filter.code !== filterName))
    const newFilterFields = filterFields.map(field => {
      return filterName !== field.code
        ? field
        : { ...field, check: false }
    })
    setFilterFields(newFilterFields)
  }

  const values = useMemo(
    () => ({
      selectedTasks,
      setSelectedTasks,
      tasks,
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
      removeFilter
    }),
    [
      selectedTasks,
      tasks,
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

  return <ControlContext.Provider value={values}>
    {children}
  </ControlContext.Provider>;
}
