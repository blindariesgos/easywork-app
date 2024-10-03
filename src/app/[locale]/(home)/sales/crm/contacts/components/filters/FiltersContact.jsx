"use client";
import React from "react";
import FilterTable from "@/src/components/FilterTable";
import useContactContext from "@/src/context/contacts";

const FiltersContact = () => {
  const contextValues = useContactContext();

  return <FilterTable contextValues={contextValues} />;
};

export default FiltersContact;
