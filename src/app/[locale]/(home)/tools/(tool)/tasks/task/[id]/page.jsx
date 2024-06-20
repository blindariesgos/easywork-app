"use client";
import SlideOver from "@/src/components/SlideOver";
import React, { Suspense } from "react";
import TaskView from "./TaskView";
import LoaderSpinner from "@/src/components/LoaderSpinner";

export default function TaskDetailsPage({ params: { id } }) {
  return (
    <SlideOver colorTag="bg-primary" samePage={`/tools/tasks?page=1`}>
      <Suspense fallback={<LoaderSpinner />}>
        <TaskView id={id} />
      </Suspense>
    </SlideOver>
  );
}
