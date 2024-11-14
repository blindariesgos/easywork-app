"use client";
import React, { Fragment, useState, useEffect, useRef } from "react";
import useReceiptContext from "@/src/context/receipts";
import FilterTable from "@/src/components/FilterTable";

const FiltersReceipt = () => {
  const contextValues = useReceiptContext();

  return <FilterTable contextValues={contextValues} />;
};

export default FiltersReceipt;
