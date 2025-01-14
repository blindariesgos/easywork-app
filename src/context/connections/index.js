"use client";

import { useContext } from "react";
import { ConnectionsContext } from "..";

export function useConnectionsContext() {
  const context = useContext(ConnectionsContext);

  if (!context) {
    throw new Error(
      "useConnectionstContext must be used within an ConnectionsProvider"
    );
  }

  return context;
}

export default useConnectionsContext;
