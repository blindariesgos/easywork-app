"use client";

import { Fragment } from "react";
import CalendarContextProvider from "../../../../../../context/calendar/provider";

export default function CalendarLayout({ children, calendar, modal }) {
  return (
    <CalendarContextProvider>
      <Fragment>
        {calendar}
        {modal}
        {children}
      </Fragment>
    </CalendarContextProvider>
  );
}
