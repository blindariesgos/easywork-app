"use client";
import React from "react";
import ProgramationsHeader from "./components/Header";
import Header from "@/src/components/header/Header";

export default function LayoutPage({ children }) {
  return (
    <div className="h-full relative flex flex-col gap-2">
      <ProgramationsHeader />
      {children}
    </div>
  );
}
