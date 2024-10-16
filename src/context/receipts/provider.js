"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ReceiptsContext } from "..";
import useAppContext from "../app";
import { useTranslation } from "react-i18next";
import { useReceipts } from "../../lib/api/hooks/receipts";
import { BsListStars } from "react-icons/bs";

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
  const defaultFilterFields = [
    {
      id: 2,
      name: t("control:portafolio:receipt:filters:expiration-date"),
      type: "date",
      check: true,
      code: "dueDate",
    },
    {
        id: 3,
        name: t("control:portafolio:receipt:filters:client"),
        type: "select-contact",
        check: true,
        code: "client",
      },
      {
        id: 8,
        name: t("control:portafolio:receipt:filters:type"),
        type: "select",
        check: true,
        code: "poliza.typeId",
        options: lists?.policies?.polizaTypes,
      },
  ]
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
        id: 2,
        name: t("control:portafolio:receipt:filters:expiration-date"),
        type: "date",
        check: true,
        code: "dueDate",
      },
      {
        id: 3,
        name: t("control:portafolio:receipt:filters:client"),
        type: "select-contact",
        check: true,
        code: "client",
      },
      {
        id: 8,
        name: t("control:portafolio:receipt:filters:type"),
        type: "select",
        check: true,
        code: "poliza.typeId",
        options: lists?.policies?.polizaTypes,
      },
      {
        id: 1,
        name: t("control:portafolio:receipt:filters:responsible"),
        type: "dropdown",
        check: true,
        code: "responsible",
        options: lists?.users,
      },
    ])
  }, [lists])

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

  useEffect(() => {
    console.log("cambio de visualizacion",displayFilters )
  }, [displayFilters])

  const values = useMemo(
    () => ({
      data,
      isLoading,
      isError,
      mutate,
      searchParam: "title",
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
      defaultFilterFields
    }),
    [
      data,
      isLoading,
      isError,
      config,
      selectedContacts,
      displayFilters,
      filterFields,
      filters,
      defaultFilterFields
    ]
  );

  return <ReceiptsContext.Provider value={values}>{children}</ReceiptsContext.Provider>;
}
