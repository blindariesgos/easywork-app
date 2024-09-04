"use client";

import { Fragment } from "react";
import CalendarContextProvider from "../../../../../../context/calendar/provider";

export default function CalendarLayout({ children, calendar }) {
  return (
    <CalendarContextProvider>
      <Fragment>
        {calendar}
        {children}
      </Fragment>
    </CalendarContextProvider>
  );
}
