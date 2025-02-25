"use client";
import SlideOver from "@/src/components/SlideOver";
import React, { Suspense } from "react";
import TaskView from "./TaskView";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useTask } from "@/src/lib/api/hooks/tasks";

export default function TaskDetailsPage({ params: { id } }) {
  const { task, isLoading, isError, mutate: mutateTask } = useTask(id);

  if (isLoading) return <LoaderSpinner />;

  if (isError) return <>Error al cargar la tarea</>;

  return (
    <SlideOver colorTag="bg-primary" samePage={`/tools/tasks?page=1`}>
      <Suspense fallback={<LoaderSpinner />}>
        <TaskView id={id} mutateTask={mutateTask} task={task} />
      </Suspense>
    </SlideOver>
  );
}
