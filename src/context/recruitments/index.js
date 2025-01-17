"use client";

import { useContext } from "react";
import { RecruitmentsContext } from "..";

export function useRecruitmentsContext() {
  const context = useContext(RecruitmentsContext);

  if (!context) {
    throw new Error(
      "useRecruitmentContext must be used within an RecruitmentsProvider"
    );
  }

  return context;
}

export default useRecruitmentsContext;
