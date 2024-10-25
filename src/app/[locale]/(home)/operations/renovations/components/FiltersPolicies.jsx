"use client";
import React from "react";
import usePolicyContext from "@/src/context/policies";
import FilterTable from "@/src/components/FilterTable";

const FiltersPolicies = () => {
  const contextValues = usePolicyContext();

  return <FilterTable contextValues={contextValues} />;
};

export default FiltersPolicies;
