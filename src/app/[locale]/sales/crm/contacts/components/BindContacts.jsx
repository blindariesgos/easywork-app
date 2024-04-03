"use client";
import useCrmContext from "@/context/crm";
import React, { useEffect } from "react";

export const revalidate = 3600

export default function BindContacts({ contacts }) {
  const { setContacts, lastContactsUpdate } = useCrmContext();
    useEffect(() => {
        setContacts(contacts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contacts, lastContactsUpdate]);

  return <></>;
}
