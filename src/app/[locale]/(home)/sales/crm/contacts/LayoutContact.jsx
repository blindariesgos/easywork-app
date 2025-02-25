"use client";
import React from "react";
import ContactsHeader from "./components/ContactsHeader";

export default function LayoutContact({ children }) {
  return (
    <div className="h-full relative flex flex-col gap-2">
      <ContactsHeader />
      {children}
    </div>
  );
}
