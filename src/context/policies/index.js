"use client";

import { useContext } from "react";
import { PoliciesContext } from "..";

export function usePolicyContext() {
  const context = useContext(PoliciesContext);

  if (!context) {
    throw new Error("usePolicyContext must be used within an usePolicyProvider");
  }

  return context;
}

export default usePolicyContext;