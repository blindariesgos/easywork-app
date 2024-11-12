"use client";
import React from "react";
import useLeadsContext from "../../../../../../../../context/leads";
import FilterTable from "@/src/components/FilterTable";

const FiltersLeads = () => {
  const contextValues = useLeadsContext();

  return <FilterTable contextValues={contextValues} />;
};

export default FiltersLeads;
