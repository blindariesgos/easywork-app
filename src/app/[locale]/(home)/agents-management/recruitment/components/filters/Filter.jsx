"use client";
import React from "react";
import useRecruitmentsContext from "@/src/context/recruitments";
import FilterTable from "@/src/components/FilterTable";

const Filter = () => {
  const contextValues = useRecruitmentsContext();

  return <FilterTable contextValues={contextValues} />;
};

export default Filter;
