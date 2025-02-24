"use client";
import React from "react";
import ControlContextProvider from "../../../../../../context/control/provider";
export default function layout({ children }) {
  return <ControlContextProvider>{children}</ControlContextProvider>;
}
