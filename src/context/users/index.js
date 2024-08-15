"use client";

import { useContext } from "react";
import { UsersContext } from "..";

export function useUserContext() {
  const context = useContext(UsersContext);

  if (!context) {
    throw new Error("useUserContext must be used within an useUserProvider");
  }

  return context;
}

export default useUserContext;