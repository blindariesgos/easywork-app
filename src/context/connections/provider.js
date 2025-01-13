"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ConnectionsContext } from "..";
import useAppContext from "../app";
import { useTranslation } from "react-i18next";
import { useConnections } from "@/src/lib/api/hooks/connections";

export default function ConnectionsContextProvider({
  children,
  customFilters = [],
}) {
  const { t } = useTranslation();
  const [config, setConfig] = useState({
    page: 1,
    limit: 5,
    orderBy: "name",
    order: "DESC",
  });
  const { lists } = useAppContext();
  const [filters, setFilters] = useState({});
  const { data, isLoading, isError, mutate } = useConnections({
    config,
    filters,
  });

  const [filterFields, setFilterFields] = useState();
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [displayFilters, setDisplayFilters] = useState({});
  const defaultFilterFields = [
    {
      id: 1,
      name: "Agente",
      type: "input",
      check: true,
      code: "name",
    },
    {
      id: 3,
      name: "Gerente de Desarrollo",
      type: "dropdown",
      check: false,
      code: "developmentManagerId",
      options: lists?.users,
    },
    {
      id: 3,
      name: t("leads:filters:created"),
      type: "date",
      check: true,
      code: "createdAt",
    },
    ...customFilters,
  ];
  const handleChangeConfig = (key, value) => {
    let newConfig = {
      ...config,
      [key]: value,
    };
    if (value == config.orderBy) {
      newConfig = {
        ...newConfig,
        order:
          value != config.orderBy
            ? "DESC"
            : config.order === "ASC"
              ? "DESC"
              : "ASC",
      };
    }

    setConfig(newConfig);
  };

  useEffect(() => {
    setFilterFields([
      {
        id: 1,
        name: "Agente",
        type: "input",
        check: true,
        code: "name",
      },
      {
        id: 3,
        name: t("agentsmanagement:accompaniments:agent:manager"),
        type: "dropdown",
        check: false,
        code: "developmentManagerId",
        options: lists?.users,
      },
      {
        id: 3,
        name: t("leads:filters:created"),
        type: "date",
        check: true,
        code: "createdAt",
      },
      {
        id: 1,
        name: t("contacts:create:cua"),
        type: "input",
        check: true,
        code: "cua",
      },
      {
        id: 3,
        name: t("agentsmanagement:accompaniments:agent:observer"),
        type: "dropdown",
        check: false,
        code: "observerId",
        options: lists?.users,
      },
      ...customFilters,
    ]);
  }, [lists]);

  useEffect(() => {
    handleChangeConfig("page", 1);
  }, [config.limit]);

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
      defaultFilterFields,
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
      defaultFilterFields,
      lists,
    ]
  );

  return (
    <ConnectionsContext.Provider value={values}>
      {children}
    </ConnectionsContext.Provider>
  );
}
