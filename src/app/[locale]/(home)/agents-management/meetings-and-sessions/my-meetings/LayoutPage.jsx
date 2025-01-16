"use client";
import React from "react";
import ManagementsHeader from "./components/Header";
import Header from "@/src/components/header/Header";

export default function LayoutPage({ children }) {
  return (
    <div className="bg-gray-100 h-full p-2 rounded-xl relative flex flex-col gap-4">
      <Header />
      <ManagementsHeader />
      {children}
    </div>
  );
}
