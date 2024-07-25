"use client";

import { useContext } from "react";
import { TasksContext } from "..";

export function useTasksContext() {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error("useToolContext must be used within an ToolContextProvider");
  }

  return context;
}

export default useTasksContext;