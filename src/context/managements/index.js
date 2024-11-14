"use client";

import { useContext } from "react";
import { ManagementsContext } from "..";

export function useManagementContext() {
  const context = useContext(ManagementsContext);

  if (!context) {
    throw new Error("useManagementContext must be used within an ManagementsProvider");
  }

  return context;
}

export default useManagementContext;