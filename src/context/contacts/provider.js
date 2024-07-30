"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ContactsContext } from "..";
import { useContacts } from "../../lib/api/hooks/contacts";

export default function ContactsContextProvider({ children }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const { contacts, isLoading, isError, mutate } = useContacts({ page, limit })

  useEffect(() => {
    setPage(1)
  }, [limit])

  const values = useMemo(
    () => ({
      data: contacts,
      isLoading,
      isError,
      mutate,
      page,
      setPage,
      limit,
      setLimit
    }),
    [
      contacts,
      isLoading,
      isError,
      page,
      limit,
    ]
  );

  return <ContactsContext.Provider value={values}>{children}</ContactsContext.Provider>;
}
