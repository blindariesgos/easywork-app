"use client";

import { useContext } from "react";
import { ReceiptsContext } from "..";

export function useUserContext() {
  const context = useContext(ReceiptsContext);

  if (!context) {
    throw new Error("useUserContext must be used within an useUserProvider");
  }

  return context;
}

export default useUserContext;