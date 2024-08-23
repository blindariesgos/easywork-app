"use client";

import React, { useMemo } from "react";
import { FilterTableContext } from "..";

export default function FilterTableContextProvider({ children, contextValues }) {
  const values = useMemo(() => contextValues,
    [
      contextValues
    ]
  );

  return <FilterTableContext.Provider value={values}>{children}</FilterTableContext.Provider>;
}
