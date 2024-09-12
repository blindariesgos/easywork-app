"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ReceiptsContext } from "..";
import useAppContext from "../app";
import { useTranslation } from "react-i18next";
import { useReceipts } from "../../lib/api/hooks/receipts";
export default function ReceiptsContextProvider({ children }) {
  const { t } = useTranslation()
  const [config, setConfig] = useState({
    page: 1,
    limit: 5,
    orderBy: "name",
    order: "DESC"
  })
  const { lists } = useAppContext()
  const [filters, setFilters] = useState({})
  const { data, isLoading, isError, mutate } = useReceipts({ config, filters })
  const [filterFields, setFilterFields] = useState()
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [displayFilters, setDisplayFilters] = useState({})

  const handleChangeConfig = (key, value) => {
    let newConfig = {
      ...config,
      [key]: value
    }
    if (value == config.orderBy) {
      newConfig = {
        ...newConfig,
        order: value != config.orderBy
          ? "DESC"
          : config.order === "ASC"
            ? "DESC"
            : "ASC"
      }
    }

    setConfig(newConfig)
  }

  useEffect(() => {
    setFilterFields([
      {
        id: 1,
        name: t("control:portafolio:receipt:filters:responsible"),
        type: "dropdown",
        check: true,
        code: "responsible",
        options: lists?.users,
      },
      {
        id: 2,
        name: t("control:portafolio:receipt:filters:expiration-date"),
        type: "date",
        check: true,
        code: "createdAt",
      },
      {
        id: 3,
        name: t("control:portafolio:receipt:filters:client"),
        type: "dropdown",
        check: true,
        code: "client",
        options: lists?.users,
      },
      {
        id: 8,
        name: t("control:portafolio:receipt:filters:rfc"),
        type: "input",
        check: false,
        code: "rfc",
      },
    ])
  }, [lists?.listContact])

  useEffect(() => {
    handleChangeConfig("page", 1)
  }, [config.limit])

  // useEffect(() => {
  //   if (Object.keys(filters).length == 0 && filterFields) {
  //     setFilterFields(filterFields?.map(field => ({
  //       ...field,
  //       check: field.code === "role"
  //     })))
  //   }
  // }, [filters])

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
      data,
      isLoading,
      isError,
      mutate,
      page: config.page,
      setPage: (value) => handleChangeConfig("page", value),
      limit: config.limit,
      setLimit: (value) => handleChangeConfig("limit", value),
      orderBy: config.orderBy,
      setOrderBy: (value) => handleChangeConfig("orderBy", value),
      order: config.order,
      removeFilter,
      selectedContacts,
      setSelectedContacts,
      displayFilters,
      setDisplayFilters,
      filterFields,
      setFilterFields,
      filters,
      setFilters,
    }),
    [
      data,
      isLoading,
      isError,
      config,
      selectedContacts,
      displayFilters,
      filterFields,
      filters
    ]
  );

  return <ReceiptsContext.Provider value={values}>{children}</ReceiptsContext.Provider>;
}
