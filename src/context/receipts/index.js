"use client";

import { useContext } from "react";
import { ReceiptsContext } from "..";

export function useReceiptContext() {
  const context = useContext(ReceiptsContext);

  if (!context) {
    throw new Error("useReceiptContext must be used within an useReceiptProvider");
  }

  return context;
}

export default useReceiptContext;