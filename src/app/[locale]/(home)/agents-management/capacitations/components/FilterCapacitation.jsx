"use client";
import React from "react";
import useCapacitationContext from "@/src/context/capacitations";
import FilterTable from "@/src/components/FilterTable";

const FilterClaims = () => {
  const contextValues = useCapacitationContext();

  return <FilterTable contextValues={contextValues} />;
};

export default FilterClaims;
