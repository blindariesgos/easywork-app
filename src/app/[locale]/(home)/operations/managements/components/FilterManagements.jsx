"use client";
import React from "react";
import useManagementContext from "@/src/context/managements";
import FilterTable from "@/src/components/FilterTable";

const FilterManagements = () => {
  const contextValues = useManagementContext();

  return <FilterTable contextValues={contextValues} />;
};

export default FilterManagements;
