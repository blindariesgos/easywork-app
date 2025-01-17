"use client";
import React from "react";
import UsersHeader from "./components/UsersHeader";
import Header from "@/src/components/header/Header";

export default function LayoutContact({ children }) {
  return (
    <div className="bg-gray-100 h-full p-2 rounded-xl relative flex flex-col gap-4">
      <Header />
      <UsersHeader />
      {children}
    </div>
  );
}
