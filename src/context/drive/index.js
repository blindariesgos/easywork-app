"use client";

import { useContext } from "react";
import { DriveContext } from "..";

export function useDriveContext() {
  const context = useContext(DriveContext);

  if (!context) {
    throw new Error("useDriveContext must be used within an DriveContextProvider");
  }

  return context;
}

export default useDriveContext;