"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CapacitationsContext } from "..";
import useAppContext from "../app";
import { useTranslation } from "react-i18next";
import { useCapacitations } from "../../lib/api/hooks/capacitations";

export default function CapacitationsContextProvider({ children }) {
  const { t } = useTranslation();
  const [config, setConfig] = useState({
    page: 1,
    limit: 5,
    orderBy: "name",
    order: "DESC",
  });
  const { lists } = useAppContext();
  const [filters, setFilters] = useState({});
  const { data, isLoading, isError, mutate } = useCapacitations({
    config,
    filters: {
      ...filters,
      renewal: true,
    },
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
      type: "input",
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
        type: "input",
        check: false,
        code: "poliza",
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
        id: 5,
        name: t("operations:policies:table:state"),
        type: "select",
        check: false,
        code: "status",
        options: [
          {
            id: "activa",
            name: "Vigente",
          },
          {
            id: "expirada",
            name: "No vigente",
          },
          {
            id: "cancelada",
            name: "Cancelada",
          },
          {
            id: "en_proceso",
            name: "En trámite",
          },
        ],
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lists?.listContact, lists?.policies]);

  useEffect(() => {
    handleChangeConfig("page", 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <CapacitationsContext.Provider value={values}>
      {children}
    </CapacitationsContext.Provider>
  );
}
