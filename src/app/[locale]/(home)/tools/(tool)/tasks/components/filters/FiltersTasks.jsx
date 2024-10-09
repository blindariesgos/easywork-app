"use client";
import React from "react";
import useTasksContext from "@/src/context/tasks";
import FilterTable from "@/src/components/FilterTable";

const FiltersTasks = () => {
  const contextValues = useTasksContext();

  return <FilterTable contextValues={contextValues} />;
};

export default FiltersTasks;
