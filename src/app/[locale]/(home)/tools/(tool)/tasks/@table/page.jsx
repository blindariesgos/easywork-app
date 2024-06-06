"use client"
import React, { useEffect, useState } from "react";
import TableTask from "./TableTask";
import { useTasks } from "@/src/lib/api/hooks/tasks";
import LoaderSpinner from "@/src/components/LoaderSpinner";


export default async function page({ params, searchParams }) {
  const [page, setPage] = useState(searchParams.page || 1);
  const [limit, setLimit] = useState(searchParams.limit || 6);

  useEffect(() => {
    setPage(searchParams.page || 1);
  }, [searchParams.page]);

  useEffect(() => {
    setLimit(searchParams.limit || 6);
  }, [searchParams.limit]);

  const { tasks, isLoading, isError } = useTasks({page, limit})
  if (isLoading) return <LoaderSpinner/>
  if (isError || !tasks) return <div>Error al cargar las tareas</div>
  return (
    <div className="relative h-full">
      <TableTask data={tasks} />
    </div>
  );
}
