"use client";

import { useContext } from "react";
import { ImportationsContext } from "..";

export function useImportationsContext() {
  const context = useContext(ImportationsContext);

  if (!context) {
    throw new Error("useToolContext must be used within an ToolContextProvider");
  }

  return context;
}

export default useImportationsContext;