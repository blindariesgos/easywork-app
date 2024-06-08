"use client";
import SlideOver from "../../../../../../../../components/SlideOver";
import React, { Suspense } from "react";
import TaskEdit from "./TaskEdit";

export default function TaskDetailsPage({ params: { id } }) {
  return (
    <SlideOver colorTag="bg-primary" samePage={`/tools/tasks?page=1`}>
      <Suspense fallback={<div>Loading task details...</div>}>
        <TaskEdit id={id} />
      </Suspense>
    </SlideOver>
  );
}
