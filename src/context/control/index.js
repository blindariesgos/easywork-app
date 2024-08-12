"use client";

import { useContext } from "react";
import { ControlContext } from "..";

export function useControlContext() {
  const context = useContext(ControlContext);

  if (!context) {
    throw new Error("useControlContext must be used within an ControlContextProvider");
  }

  return context;
}

export default useControlContext;