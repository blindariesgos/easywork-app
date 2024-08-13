"use client";

import React, { useEffect, useMemo, useState } from "react";
import { LeadsContext } from "..";
import { useLeads } from "../../lib/api/hooks/leads";
import { useTranslation } from "react-i18next";
import useAppContext from "../app";
import { useCommon } from "@/src/hooks/useCommon";

export default function LeadsContextProvider({ children }) {
  const { t } = useTranslation()
  const { lists } = useAppContext()
  const [filters, setFilters] = useState({})
  const { stagesLead, statusLead } = useCommon()
  const [config, setConfig] = useState({
    limit: 5,
    page: 1,
    orderBy: "createdAt",
    order: "DESC"
  })
  const { leads, isLoading, isError, mutate } = useLeads({ config, filters })
  const [filterFields, setFilterFields] = useState()
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [displayFilters, setDisplayFilters] = useState({})

  useEffect(() => {
    handleChangeConfig("page", 1)
  }, [config.limit])

  useEffect(() => {
    setFilterFields([
      {
        id: 1,
        name: t("leads:filters:origin"),
        type: "select",
        options: lists?.listContact?.contactSources || [],
        check: true,
        code: "origin",
      },
      {
        id: 2,
        name: t("leads:filters:stages:name"),
        type: "select",
        check: true,
        code: "state",
        options: stagesLead,
      },
      {
        id: 3,
        name: t("leads:filters:created"),
        type: "date",
        check: true,
        code: "createdAt",
      },

      {
        id: 4,
        name: t("leads:filters:status"),
        type: "select",
        check: true,
        code: "status",
        options: statusLead,
      },
      // {
      //   id: 5,
      //   name: t("contacts:filters:fullname"),
      //   type: "input",
      //   check: false,
      //   code: "name",
      // },
      // {
      //   id: 6,
      //   name: t("contacts:filters:contact-type"),
      //   type: "select",
      //   options: lists?.listContact?.contactTypes || [],
      //   check: false,
      //   code: "typeContact",
      // },
      // {
      //   id: 7,
      //   name: t("contacts:filters:cua"),
      //   type: "input",
      //   check: false,
      //   code: "cua",
      // },
      // {
      //   id: 8,
      //   name: t("contacts:filters:rfc"),
      //   type: "input",
      //   check: false,
      //   code: "rfc",
      // },
    ])
  }, [lists?.listContact])

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
    console.log({ newConfig, config })
    setConfig(newConfig)
  }

  const values = useMemo(
    () => ({
      data: leads,
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
      displayFilters,
      setDisplayFilters,
      filterFields,
      setFilterFields,
      filters,
      setFilters,
    }),
    [
      leads,
      isLoading,
      isError,
      config,
      displayFilters,
      filterFields,
      filters,
    ]
  );

  return <LeadsContext.Provider value={values}>{children}</LeadsContext.Provider>;
}
