"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FundRecoveriesContext } from "..";
import useAppContext from "../app";
import { useTranslation } from "react-i18next";
import { useFundRecoveries } from "../../lib/api/hooks/fundRecoveries";

export default function FundRecoveriesContextProvider({ children }) {
  const { t } = useTranslation();
  const [config, setConfig] = useState({
    page: 1,
    limit: 5,
    orderBy: "name",
    order: "DESC",
  });
  const { lists } = useAppContext();
  const [filters, setFilters] = useState({});
  const { data, isLoading, isError, mutate } = useFundRecoveries({
    config,
    filters,
  });
  const [filterFields, setFilterFields] = useState([
    {
      id: 0,
      name: t("control:portafolio:receipt:filters:responsible"),
      type: "select-user",
      check: true,
      code: "assignedById",
    },
    {
      id: 2,
      name: t("operations:policies:table:policy"),
      type: "select-policy",
      check: false,
      code: "poliza",
    },
    {
      id: 3,
      name: t("control:portafolio:receipt:filters:client"),
      type: "select-contact",
      check: false,
      code: "client",
    },
    {
      id: 4,
      name: t("operations:policies:general:intermediary"),
      type: "select-user",
      check: false,
      code: "agenteIntermediarioId",
    },
  ]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [displayFilters, setDisplayFilters] = useState({});
  const defaultFilterFields = [
    {
      id: 0,
      name: t("control:portafolio:receipt:filters:responsible"),
      type: "select-user",
      check: true,
      code: "assignedById",
    },
    {
      id: 2,
      name: t("operations:policies:table:policy"),
      type: "select-policy",
      check: false,
      code: "poliza",
    },
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
    <FundRecoveriesContext.Provider value={values}>
      {children}
    </FundRecoveriesContext.Provider>
  );
}
