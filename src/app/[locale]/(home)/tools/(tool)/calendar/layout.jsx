"use client";

import { CalendarView } from "@/src/sections/calendar/view";
// TODO: @Luis modificado

// import { Fragment } from "react";
// import CalendarContextProvider from "../../../../../../context/calendar/provider";

export default function CalendarLayout({ children }) {
  return (
    <>
      <CalendarView />
      {children}
    </>
    // <CalendarContextProvider>
    //   <Fragment>
    //     {calendar}
    // {/* </Fragment>
    // </CalendarContextProvider> */}
  );
}
