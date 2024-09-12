"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ContactsContext } from "..";
import { useContacts } from "../../lib/api/hooks/contacts";
import useAppContext from "../app";
import { useTranslation } from "react-i18next";

export default function ContactsContextProvider({ children }) {
  const { t } = useTranslation()
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const { lists } = useAppContext()
  const [filters, setFilters] = useState({})
  const { contacts, isLoading, isError, mutate } = useContacts({ page, limit, filters })
  const [filterFields, setFilterFields] = useState()
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [displayFilters, setDisplayFilters] = useState({})

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
        code: "type",
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
    setPage(1)
  }, [limit])

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
      data: contacts,
      isLoading,
      isError,
      mutate,
      page,
      setPage,
      limit,
      setLimit,
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
      contacts,
      isLoading,
      isError,
      page,
      limit,
      selectedContacts,
      displayFilters,
      filterFields,
      filters
    ]
  );

  return <ContactsContext.Provider value={values}>{children}</ContactsContext.Provider>;
}
