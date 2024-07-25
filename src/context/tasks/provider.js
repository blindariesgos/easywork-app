"use client";

import React, { useEffect, useMemo, useState } from "react";
import { TasksContext } from "..";
import { useTasks } from "../../lib/api/hooks/tasks";

export default function TasksContextProvider({ children }) {
  const [filters, setFilters] = useState([])
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const { tasks, isLoading, isError, mutate } = useTasks({ page, limit, filters });

  useEffect(() => {
    setPage(1)
  }, [limit])

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
      setFilters
    }),
    [
      selectedTasks,
      tasks,
      isLoading,
      isError,
      mutate,
      page,
      limit,
      filters
    ]
  );

  return <TasksContext.Provider value={values}>
    {children}
  </TasksContext.Provider>;
}
