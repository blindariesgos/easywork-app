"use client";
import React from "react";
import ManagementsHeader from "./components/Header";

export default function LayoutPage({ children }) {
  return (
    <div className="h-full relative flex flex-col gap-2">
      <ManagementsHeader />
      {children}
    </div>
  );
}
