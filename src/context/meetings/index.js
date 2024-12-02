"use client";

import { useContext } from "react";
import { MeetingsContext } from "..";

export function useMeetingsContext() {
  const context = useContext(MeetingsContext);

  if (!context) {
    throw new Error(
      "useMeetingsContext must be used within an MeetingsProvider"
    );
  }

  return context;
}

export default useMeetingsContext;
