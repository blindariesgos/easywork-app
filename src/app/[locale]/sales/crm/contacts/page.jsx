"use client";
import useCrmContext from "@/context/crm";
import { getContacts } from "@/lib/api";
import React, { useEffect } from "react";

export default function Page() {
  const { setContacts, lastContactsUpdate } = useCrmContext();

  useEffect(() => {
    async function fetchData() {
      const response = await getContacts();
      setContacts(response);
    }

    fetchData();
  }, [lastContactsUpdate]);

  return <></>;
}
