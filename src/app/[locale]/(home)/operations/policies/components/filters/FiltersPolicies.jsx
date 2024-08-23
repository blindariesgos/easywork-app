"use client";
import React from "react";
import usePolicyContext from "../../../../../../../context/policies";
import FilterTable from "../../../../../../../components/FilterTable";

const FiltersPolicies = () => {
  const contextValues = usePolicyContext();

  return <FilterTable contextValues={contextValues} />;
};

export default FiltersPolicies;
