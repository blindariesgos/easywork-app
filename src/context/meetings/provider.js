"use client";

import React, { useEffect, useMemo, useState } from "react";
import { MeetingsContext } from "..";
import useAppContext from "../app";
import { useTranslation } from "react-i18next";
import { usePolicies } from "../../lib/api/hooks/policies";

export default function MeetingsContextProvider({ children }) {
  const { t } = useTranslation();
  const [config, setConfig] = useState({
    page: 1,
    limit: 5,
    orderBy: "name",
    order: "DESC",
  });
  const { lists } = useAppContext();
  const [filters, setFilters] = useState({});
  const { data, isLoading, isError, mutate } = usePolicies({
    config,
    filters: {
      ...filters,
      renewal: "true",
    },
  });
  const [filterFields, setFilterFields] = useState();
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [displayFilters, setDisplayFilters] = useState({});
  const defaultFilterFields = [
    {
      id: 0,
      name: "Agente",
      type: "dropdown",
      check: true,
      code: "assignedById",
      options: lists?.users,
    },
    {
      id: 9,
      name: "Titulo",
      type: "input",
      check: false,
      code: "name",
    },
    {
      id: 3,
      name: t("control:portafolio:receipt:filters:client"),
      type: "select-contact",
      check: true,
      code: "contactId",
    },
    {
      id: 3,
      name: "Responsable",
      type: "dropdown",
      check: false,
      code: "responsibleId",
      options: lists?.users,
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
        name: "Agente",
        type: "dropdown",
        check: true,
        code: "assignedById",
        options: lists?.users,
      },
      {
        id: 1,
        name: "Titulo",
        type: "input",
        check: false,
        code: "name",
      },
      {
        id: 2,
        name: t("control:portafolio:receipt:filters:client"),
        type: "select-contact",
        check: true,
        code: "contactId",
      },
      {
        id: 3,
        name: "Responsable",
        type: "dropdown",
        check: false,
        code: "responsibleId",
        options: lists?.users,
      },
      {
        id: 4,
        name: "Fecha de reunion",
        type: "date",
        check: true,
        code: "vigenciaHasta",
      },
      {
        id: 5,
        name: "Prospecto",
        type: "select-lead",
        check: false,
        code: "lead",
      },
      {
        id: 6,
        name: t("operations:policies:table:policy"),
        type: "select-policy",
        check: false,
        code: "poliza",
      },
    ]);
  }, [lists?.listContact, lists?.policies]);

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
      data: {
        items: [],
        metadata: {},
      },
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
    <MeetingsContext.Provider value={values}>
      {children}
    </MeetingsContext.Provider>
  );
}
