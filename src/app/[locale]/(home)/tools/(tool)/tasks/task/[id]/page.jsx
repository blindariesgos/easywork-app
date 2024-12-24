"use client";
import SlideOver from "@/src/components/SlideOver";
import React, { Suspense } from "react";
import TaskView from "./TaskView";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useTask } from "@/src/lib/api/hooks/tasks";

export default function TaskDetailsPage({ params: { id } }) {
  const { task, isLoading, isError, mutate: mutateTask } = useTask(id);

  if (isLoading)
    return (
      <div className="flex flex-col h-screen relative w-full overflow-y-auto">
        <div
          className={`flex flex-col flex-1 bg-gray-600 opacity-100 shadow-xl text-black rounded-tl-[35px] rounded-bl-[35px] p-2 sm:p-4 h-full overflow-y-auto`}
        >
          <LoaderSpinner />
        </div>
      </div>
    );

  if (isError) return <>Error al cargar la tarea</>;
  
  return (
    <SlideOver colorTag="bg-primary" samePage={`/tools/tasks?page=1`}>
      <Suspense fallback={<LoaderSpinner />}>
        <TaskView id={id} mutateTask={mutateTask} task={task} />
      </Suspense>
    </SlideOver>
  );
}
