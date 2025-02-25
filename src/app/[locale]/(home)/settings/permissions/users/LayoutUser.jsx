"use client";
import React from "react";
import UsersHeader from "./components/UsersHeader";

export default function LayoutContact({ children }) {
  return (
    <div className="h-full relative flex flex-col gap-2">
      <UsersHeader />
      {children}
    </div>
  );
}
