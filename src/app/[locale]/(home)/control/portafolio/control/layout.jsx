"use client";
import React from "react";
import Header from "@/src/components/header/Header";
import ControlContextProvider from "../../../../../../context/control/provider";
export default function layout({ children }) {
  return (
    <ControlContextProvider>
      <div className="bg-gray-100 h-full p-2 rounded-xl relative flex flex-col gap-4">
        <Header />
        {children}
      </div>
    </ControlContextProvider>
  );
}
