"use client";
import React from "react";
import useControlContext from "@/src/context/control";
import FilterTable from "@/src/components/FilterTable";

const FiltersControl = () => {
  const contextValues = useControlContext();

  return <FilterTable contextValues={contextValues} />;
};

export default FiltersControl;
