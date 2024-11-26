"use client";

import { useContext } from "react";
import { CapacitationsContext } from "..";

export function useCapacitationContext() {
  const context = useContext(CapacitationsContext);

  if (!context) {
    throw new Error("useCapacitationContext must be used within an CapacitationsProvider");
  }

  return context;
}

export default useCapacitationContext;