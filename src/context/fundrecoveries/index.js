"use client";

import { useContext } from "react";
import { FundRecoveriesContext } from "..";

export function useFundRecoveriesContext() {
  const context = useContext(FundRecoveriesContext);

  if (!context) {
    throw new Error("useFundRecoveriesContext must be used within an FundRecoveriesProvider");
  }

  return context;
}

export default useFundRecoveriesContext;