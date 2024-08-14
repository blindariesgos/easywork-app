"use client";

import React, { useEffect, useMemo, useState } from "react";
import { UsersContext } from "..";
import useAppContext from "../app";
import { useTranslation } from "react-i18next";
import { useUsers } from "../../lib/api/hooks/users";

export default function UsersContextProvider({ children }) {
  const { t } = useTranslation()
  const [config, setConfig] = useState({
    page: 1,
    limit: 5,
    orderBy: "name",
    order: "DESC"
  })
  const { lists } = useAppContext()
  const [filters, setFilters] = useState({})
  const { data, isLoading, isError, mutate } = useUsers({ config, filters })
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
        name: t("contacts:filters:responsible"),
        type: "dropdown",
        check: true,
        code: "responsible",
        options: lists?.users
      },
      {
        id: 2,
        name: t("contacts:filters:created"),
        type: "date",
        check: true,
        code: "createdAt",
      },
      {
        id: 3,
        name: t("contacts:filters:origin"),
        type: "select",
        options: lists?.listContact?.contactSources || [],
        check: true,
        code: "origin",
      },
      {
        id: 4,
        name: t("contacts:filters:created-by"),
        type: "dropdown",
        check: true,
        code: "createdby",
        options: lists?.users
      },
      {
        id: 5,
        name: t("contacts:filters:fullname"),
        type: "input",
        check: false,
        code: "name",
      },
      {
        id: 6,
        name: t("contacts:filters:contact-type"),
        type: "select",
        options: lists?.listContact?.contactTypes || [],
        check: false,
        code: "typeContact",
      },
      {
        id: 7,
        name: t("contacts:filters:cua"),
        type: "input",
        check: false,
        code: "cua",
      },
      {
        id: 8,
        name: t("contacts:filters:rfc"),
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
      data: data,
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

  return <UsersContext.Provider value={values}>{children}</UsersContext.Provider>;
}
