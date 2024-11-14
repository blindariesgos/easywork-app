"use client";

import { useContext } from "react";
import { ClaimsContext } from "..";

export function useClaimContext() {
  const context = useContext(ClaimsContext);

  if (!context) {
    throw new Error("useClaimContext must be used within an ClaimsProvider");
  }

  return context;
}

export default useClaimContext;