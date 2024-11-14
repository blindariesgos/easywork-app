"use client";
import React from "react";
import useProgramationContext from "@/src/context/programations";
import FilterTable from "@/src/components/FilterTable";

const FilterClaims = () => {
  const contextValues = useProgramationContext();

  return <FilterTable contextValues={contextValues} />;
};

export default FilterClaims;
