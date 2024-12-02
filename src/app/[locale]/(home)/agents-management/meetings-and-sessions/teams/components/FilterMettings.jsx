"use client";
import React from "react";
import useMeetingContext from "@/src/context/meetings";
import FilterTable from "@/src/components/FilterTable";

const FilterManagements = () => {
  const contextValues = useMeetingContext();

  return <FilterTable contextValues={contextValues} />;
};

export default FilterManagements;
