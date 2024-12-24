import SlideOver from "@/src/components/SlideOver";
import React from "react";
import TaskEditor from "./TaskEditor";

export default function page() {
  return (
    <SlideOver colorTag="bg-primary" samePage={`/tools/tasks?page=1`}>
      <TaskEditor />
    </SlideOver>
  );
}
