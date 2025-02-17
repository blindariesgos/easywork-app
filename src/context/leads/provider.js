"use client";

import React, { useEffect, useMemo, useState } from "react";
import { LeadsContext } from "..";
import { useLeads } from "../../lib/api/hooks/leads";
import { useTranslation } from "react-i18next";
import useAppContext from "../app";
import { useCommon } from "@/src/hooks/useCommon";
import { CancelLeadReasons } from "@/src/utils/stages";

export default function LeadsContextProvider({ children }) {
  const { t } = useTranslation();
  const { lists } = useAppContext();
  const [isOpenValidation, setIsOpenValidation] = useState(false);
  const [policyInfo, setPolicyInfo] = useState();
  const [filters, setFilters] = useState({});
  const { stagesLead, statusLead } = useCommon();
  const [config, setConfig] = useState({
    limit: 5,
    page: 1,
    orderBy: "createdAt",
    order: "DESC",
  });
  const { leads, isLoading, isError, mutate } = useLeads({ config, filters });
  const [filterFields, setFilterFields] = useState();
  const [displayFilters, setDisplayFilters] = useState({});
  const defaultFilterFields = [
    {
      id: 1,
      name: t("leads:filters:origin"),
      type: "select",
      options: lists?.listContact?.contactSources || [],
      check: true,
      code: "sourceId",
    },
    {
      id: 2,
      name: t("leads:filters:stages:name"),
      type: "select",
      check: true,
      code: "stageId",
      options: [
        ...(lists?.listLead?.leadStages ?? []),
        {
          id: "46b04e7a-3775-4a00-abfa-c195d7e17b81",
          name: "Póliza Generada",
        },
      ],
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
    {
      id: 5,
      name: t("contacts:filters:responsible"),
      type: "dropdown",
      check: true,
      code: "assignedById",
      options: lists?.users,
    },
  ];
  useEffect(() => {
    handleChangeConfig("page", 1);
  }, [config.limit]);

  useEffect(() => {
    setFilterFields([
      {
        id: 1,
        name: t("leads:filters:origin"),
        type: "select",
        options: lists?.listContact?.contactSources || [],
        check: true,
        code: "sourceId",
      },
      {
        id: 2,
        name: t("leads:filters:stages:name"),
        type: "select",
        check: true,
        code: "stageId",
        options: [
          ...(lists?.listLead?.leadStages ?? []),
          {
            id: "46b04e7a-3775-4a00-abfa-c195d7e17b81",
            name: "Póliza Generada",
          },
        ],
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
      {
        id: 5,
        name: t("contacts:filters:responsible"),
        type: "dropdown",
        check: true,
        code: "assignedById",
        options: lists?.users,
      },
      {
        id: 6,
        name: t("operations:policies:general:type"),
        type: "select",
        check: false,
        code: "polizaTypeId",
        options: lists?.policies?.polizaTypes ?? [],
      },
      {
        id: 7,
        name: t("control:portafolio:control:form:currency"),
        type: "select",
        check: false,
        code: "quoteCurrencyId",
        options: lists?.receipts?.currencies,
      },
      {
        id: 8,
        name: "Razón de pérdida del prospecto",
        type: "select",
        check: false,
        code: "cancelReasonId",
        options: CancelLeadReasons,
      },
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
    ]);
  }, [lists?.listContact]);

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
      defaultFilterFields,
      isOpenValidation,
      setIsOpenValidation,
      policyInfo,
      setPolicyInfo,
    }),
    [
      leads,
      policyInfo,
      isOpenValidation,
      isLoading,
      isError,
      config,
      displayFilters,
      filterFields,
      filters,
      defaultFilterFields,
    ]
  );

  return (
    <LeadsContext.Provider value={values}>{children}</LeadsContext.Provider>
  );
}
