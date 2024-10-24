"use client";

import { useContext } from "react";
import { RenovationsContext } from "..";

export function useRenovationContext() {
  const context = useContext(RenovationsContext);

  if (!context) {
    throw new Error("useRenovationContext must be used within an RenovationProvider");
  }

  return context;
}

export default useRenovationContext;