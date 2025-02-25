"use client";
import React from "react";
import RefundsHeader from "./components/Header";
import Header from "@/src/components/header/Header";

export default function LayoutPage({ children }) {
  return (
    <div className="h-full relative flex flex-col gap-2">
      <RefundsHeader />
      {children}
    </div>
  );
}
