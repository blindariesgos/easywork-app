"use client";

import { useContext } from "react";
import { CalendarContext } from "..";

export function useCalendarContext() {
  const context = useContext(CalendarContext);

  if (!context) {
    throw new Error("useCalendarContext must be used within an useCalendarProvider");
  }

  return context;
}

export default useCalendarContext;