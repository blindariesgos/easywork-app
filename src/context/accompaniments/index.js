"use client";

import { useContext } from "react";
import { AccompanimentsContext } from "..";

export function useAccompanimentContext() {
  const context = useContext(AccompanimentsContext);

  if (!context) {
    throw new Error("useAccompanimentContext must be used within an AccompanimentsProvider");
  }

  return context;
}

export default useAccompanimentContext;