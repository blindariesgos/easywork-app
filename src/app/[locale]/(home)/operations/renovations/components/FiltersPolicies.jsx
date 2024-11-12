"use client";
import React from "react";
import FilterTable from "@/src/components/FilterTable";
import useRenovationContext from "@/src/context/renovations";

const FiltersPolicies = () => {
  const contextValues = useRenovationContext();

  return <FilterTable contextValues={contextValues} />;
};

export default FiltersPolicies;
