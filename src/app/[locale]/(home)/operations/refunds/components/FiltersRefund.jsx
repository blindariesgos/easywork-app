"use client";
import React from "react";
import useRefundContext from "@/src/context/refunds";
import FilterTable from "@/src/components/FilterTable";

const FilterClaims = () => {
  const contextValues = useRefundContext();

  return <FilterTable contextValues={contextValues} />;
};

export default FilterClaims;
