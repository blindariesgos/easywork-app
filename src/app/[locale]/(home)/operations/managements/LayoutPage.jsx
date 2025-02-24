"use client";
import React from "react";
import ManagementsHeader from "./components/Header";
import Cards from "./components/Cards";

export default function LayoutPage({ children }) {
  return (
    <div className="h-full relative flex flex-col gap-2">
      <ManagementsHeader />
      <Cards />
      {children}
    </div>
  );
}
