"use client";

import React, { useMemo, useState } from "react";
import { ToolContext } from "..";

export default function ToolContextProvider({ children }) {
  const [contacts, setContacts] = useState([]);
  const [crmUsers, setToolUsers] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);

  const values = useMemo(
    () => ({
      contacts,
      setContacts,
      crmUsers,
      setToolUsers,
      selectedTasks,
      setSelectedTasks,
    }),
    [contacts, crmUsers, selectedTasks]
  );

  return <ToolContext.Provider value={values}>{children}</ToolContext.Provider>;
}
