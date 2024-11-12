"use client";

import { useContext } from "react";
import { ProgramationsContext } from "..";

export function useProgramationContext() {
  const context = useContext(ProgramationsContext);

  if (!context) {
    throw new Error("useProgramationContext must be used within an ProgramationProvider");
  }

  return context;
}

export default useProgramationContext;