"use client";
import React from "react";
import PolicyHeader from "./components/PolicyHeader";
import Header from "@/src/components/header/Header";

export default function LayoutPolicies({ children }) {
  return (
    <div className="bg-gray-100 h-full p-2 rounded-xl relative flex flex-col gap-4">
      <Header />
      <PolicyHeader />
      {children}
    </div>
  );
}
