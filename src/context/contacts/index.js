"use client";

import { useContext } from "react";
import { ContactsContext } from "..";

export function useContactContext() {
  const context = useContext(ContactsContext);

  if (!context) {
    throw new Error("useContactContext must be used within an useContactProvider");
  }

  return context;
}

export default useContactContext;