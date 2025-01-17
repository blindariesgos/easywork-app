"use client";
import React from "react";
import useConnectionsContext from "@/src/context/connections";
import FilterTable from "@/src/components/FilterTable";

const FilterClaims = () => {
  const contextValues = useConnectionsContext();

  return <FilterTable contextValues={contextValues} />;
};

export default FilterClaims;
