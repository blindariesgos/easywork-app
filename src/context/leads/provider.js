"use client";

import React, { useEffect, useMemo, useState } from "react";
import { LeadsContext } from "..";
import { useLeads } from "../../lib/api/hooks/leads";

export default function LeadsContextProvider({ children }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const { leads, isLoading, isError, mutate } = useLeads({ page, limit })

  useEffect(() => {
    setPage(1)
  }, [limit])

  const values = useMemo(
    () => ({
      data: leads,
      isLoading,
      isError,
      mutate,
      page,
      setPage,
      limit,
      setLimit
    }),
    [
      leads,
      isLoading,
      isError,
      page,
      limit,
    ]
  );

  return <LeadsContext.Provider value={values}>{children}</LeadsContext.Provider>;
}
