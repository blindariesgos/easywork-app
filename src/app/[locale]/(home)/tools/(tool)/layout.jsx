"use client";
import Header from "../../../../../components/header/Header";
import React from "react";

export default function ToolsLayout({ children }) {
  return (
    <div className="bg-gray-100 p-4 rounded-xl h-auto">
      <Header />
      <div className="h-[90%]">{children}</div>
    </div>
  );
}
