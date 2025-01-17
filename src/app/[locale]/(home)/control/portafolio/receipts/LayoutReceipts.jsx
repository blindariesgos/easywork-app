"use client";
import React from "react";

export default function LayoutReceipts({ children }) {
  return (
    <div className="bg-gray-100 h-full p-2 rounded-xl relative flex flex-col gap-4">
      {children}
    </div>
  );
}
