"use client";
import React from "react";
import useAccompanimentsContext from "@/src/context/accompaniments";
import FilterTable from "@/src/components/FilterTable";

const FilterClaims = () => {
  const contextValues = useAccompanimentsContext();

  return <FilterTable contextValues={contextValues} />;
};

export default FilterClaims;