"use client";

import { useContext } from "react";
import { CustomImportContext } from "..";

export function useCustomImportContext() {
  const context = useContext(CustomImportContext);

  if (!context) {
    throw new Error(
      "useCustomImportContext must be used within an useCustomImportProvider"
    );
  }

  return context;
}

export default useCustomImportContext;
