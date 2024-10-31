"use client";
import React from "react";
import useFundRecoveriesContext from "@/src/context/fundrecoveries";
import FilterTable from "@/src/components/FilterTable";

const FilterFundRecoveries = () => {
  const contextValues = useFundRecoveriesContext();

  return <FilterTable contextValues={contextValues} />;
};

export default FilterFundRecoveries;
