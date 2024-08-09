"use client";

import { useContext } from "react";
import { LeadsContext } from "..";

export function useLeadContext() {
  const context = useContext(LeadsContext);

  if (!context) {
    throw new Error("useLeadContext must be used within an useLeadProvider");
  }

  return context;
}

export default useLeadContext;