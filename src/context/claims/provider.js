"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ClaimsContext } from "..";
import useAppContext from "../app";
import { useTranslation } from "react-i18next";
import { useClaims } from "../../lib/api/hooks/claims";
export default function ClaimsContextProvider({ children }) {
  const { t } = useTranslation();
  const [config, setConfig] = useState({
    page: 1,
    limit: 5,
    orderBy: "title",
    order: "DESC",
  });
  const { lists } = useAppContext();
  const [filters, setFilters] = useState({});
  const { data, isLoading, isError, mutate } = useClaims({
    config,
    filters,
  });
  const [filterFields, setFilterFields] = useState();
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
      id: 1,
      name: t("control:portafolio:receipt:filters:expiration-date"),
      type: "date",
      check: true,
      code: "vigenciaHasta",
    },
    {
      id: 2,
      name: t("operations:policies:table:policy"),
      type: "select-policy",
      check: false,
      code: "polizaId",
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
    setFilterFields([
      {
        id: 0,
        name: t("control:portafolio:receipt:filters:responsible"),
        type: "select-user",
        check: true,
        code: "assignedById",
      },
      {
        id: 1,
        name: t("control:portafolio:receipt:filters:expiration-date"),
        type: "date",
        check: true,
        code: "vigenciaHasta",
      },
      {
        id: 2,
        name: t("operations:policies:table:policy"),
        type: "select-policy",
        check: false,
        code: "polizaId",
      },
      {
        id: 3,
        name: t("control:portafolio:receipt:filters:client"),
        type: "select-user",
        check: false,
        code: "client",
      },
      {
        id: 4,
        name: t("operations:policies:general:intermediary"),
        type: "select",
        check: false,
        code: "agenteIntermediarioId",
        options: lists?.policies?.agentesIntermediarios,
      },
      {
        id: 6,
        name: t("operations:policies:general:type"),
        type: "select",
        check: false,
        code: "typeId",
        options: lists?.policies?.polizaTypes,
      },
      {
        id: 7,
        name: t("operations:policies:general:payment-frequency"),
        type: "select",
        check: false,
        code: "frecuenciaCobroId",
        options: lists?.policies?.polizaFrecuenciasPago,
      },
      {
        id: 8,
        name: t("operations:policies:general:payment-method"),
        type: "select",
        check: false,
        code: "formaCobroId",
        options: lists?.policies?.polizaFormasCobro,
      },
    ]);
  }, [lists?.listContact, lists?.policies]);

  useEffect(() => {
    handleChangeConfig("page", 1);
  }, [config.limit]);

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
    <ClaimsContext.Provider value={values}>{children}</ClaimsContext.Provider>
  );
}
