"use client";

import { useContext } from "react";
import { RefundsContext } from "..";

export function useRefundContext() {
  const context = useContext(RefundsContext);

  if (!context) {
    throw new Error("useRefundContext must be used within an RefundsProvider");
  }

  return context;
}

export default useRefundContext;