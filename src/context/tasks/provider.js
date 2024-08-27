"use client";

import React, { useEffect, useMemo, useState } from "react";
import { TasksContext } from "..";
import { useTasks } from "../../lib/api/hooks/tasks";
import { useTasksConfigs } from "@/src/hooks/useCommon";
import { useTranslation } from "react-i18next";
import useAppContext from "../app";
import { useSession } from "next-auth/react";

export default function TasksContextProvider({ children, userId }) {
  const session = useSession()
  const { t } = useTranslation()
  const [filters, setFilters] = useState([])
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const { tasks, isLoading, isError, mutate } = useTasks({ page, limit, filters, userId: session?.data?.user?.id });
  const { status } = useTasksConfigs();
  const { lists } = useAppContext();
  const [displayFilters, setDisplayFilters] = useState({})
  const [filterFields, setFilterFields] = useState();

  useEffect(() => {
    if (!lists?.users || lists?.users?.length == 0) return
    setFilterFields([
      {
        id: 1,
        name: t("tools:tasks:filters:fields:role"),
        options: [
          {
            name: "Participante",
            value: "participants",
            id: 1,
          },
          {
            name: "Creador",
            value: "createdBy",
            id: 2,
          },
          {
            name: "Responsable",
            value: "responsible",
            id: 3,
          },
          {
            value: "observers",
            name: "Observador",
            id: 4,
          },
        ],
        type: "select",
        check: true,
        code: "role",
      },
      {
        id: 2,
        name: t("tools:tasks:filters:fields:status"),
        options: status,
        type: "multipleSelect",
        check: false,
        code: "status",
      },
      {
        id: 3,
        name: t("tools:tasks:filters:fields:responsible"),
        type: "dropdown",
        options: lists?.users,
        check: false,
        code: "responsible",
      },
      {
        id: 4,
        name: t("tools:tasks:filters:fields:limit-date"),
        type: "date",
        check: false,
        code: "deadline",
        date: "newDate",
        state: 1,
      },
      {
        id: 11,
        name: t("tools:tasks:filters:fields:createdThe"),
        type: "date",
        check: false,
        code: "createdAt",
        date: "newDate1",
        state: 2,
      },
      {
        id: 5,
        name: t("tools:tasks:filters:fields:createdBy"),
        type: "dropdown",
        check: false,
        code: "createdBy",
        options: lists?.users,
      },
      {
        id: 6,
        name: t("tools:tasks:filters:fields:tag"),
        type: "tags",
        check: false,
        code: "tags",
      },
      {
        id: 7,
        name: t("tools:tasks:filters:fields:closed"),
        type: "date",
        check: false,
        code: "completedTime",
        date: "newDate2",
        state: 3,
      },
      {
        id: 8,
        name: t("tools:tasks:filters:fields:name"),
        type: "input",
        check: false,
        code: "name",
      },
      {
        id: 9,
        name: t("tools:tasks:filters:fields:participant"),
        type: "dropdown",
        check: false,
        code: "participants",
        options: lists?.users,
      },
      {
        id: 10,
        name: t("tools:tasks:filters:fields:observer"),
        type: "dropdown",
        check: false,
        code: "observers",
        options: lists?.users,
      },
    ])
  }, [lists?.users, status])

  useEffect(() => {
    if (Object.keys(filters).length == 0 && filterFields) {
      setFilterFields(filterFields?.map(field => ({
        ...field,
        check: field.code === "role"
      })))
    }
  }, [filters])

  useEffect(() => {
    setPage(1)
  }, [limit])


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
      selectedTasks,
      setSelectedTasks,
      tasks,
      isLoading,
      isError,
      page,
      setPage,
      limit,
      setLimit,
      mutate,
      filters,
      setFilters,
      filterFields,
      setFilterFields,
      displayFilters,
      setDisplayFilters,
      removeFilter
    }),
    [
      selectedTasks,
      tasks,
      isLoading,
      isError,
      mutate,
      page,
      limit,
      filters,
      filterFields,
      displayFilters,
    ]
  );

  return <TasksContext.Provider value={values}>
    {children}
  </TasksContext.Provider>;
}
