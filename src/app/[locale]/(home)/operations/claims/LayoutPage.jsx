"use client";
import React from "react";
import ClaimsHeader from "./components/Header";
import Header from "@/src/components/header/Header";

export default function LayoutPage({ children }) {
  return (
    <div className="h-full relative flex gap-2 flex-col">
      <ClaimsHeader />
      {children}
    </div>
  );
}
