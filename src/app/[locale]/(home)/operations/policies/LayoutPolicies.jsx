"use client";
import React from "react";
import PolicyHeader from "./components/PolicyHeader";

export default function LayoutPolicies({ children }) {
  return (
    <div className="h-full relative flex flex-col gap-2">
      <PolicyHeader />
      {children}
    </div>
  );
}
