"use client";

import { useContext } from "react";
import { FilterTableContext } from "..";

export function useFilterTableContext() {
  const context = useContext(FilterTableContext);

  if (!context) {
    throw new Error("useFilterTableContext must be used within an useFilterTableProvider");
  }

  return context;
}

export default useFilterTableContext;