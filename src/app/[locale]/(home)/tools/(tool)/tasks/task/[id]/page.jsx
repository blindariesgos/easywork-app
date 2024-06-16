"use client";
import SlideOver from "@/src/components/SlideOver";
import React, { Suspense } from "react";
import TaskView from "./TaskView";

export default function TaskDetailsPage({ params: { id } }) {
  return (
    <SlideOver colorTag="bg-primary" samePage={`/tools/tasks?page=1`}>
      <Suspense fallback={<div>Loading task details...</div>}>
        <TaskView id={id} />
      </Suspense>
    </SlideOver>
  );
}
