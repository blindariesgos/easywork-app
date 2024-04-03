import { useEffect } from "react";
import { getContact } from "@/lib/api";
import React, { Suspense } from "react";
import ShowContactSkeleton from "./ShowContactSkeleton";
import useCrmContext from "@/context/crm";

export default function WrapperContact({ contactID, children }) {
  const { setCurrentContact, lastContactUpdate } = useCrmContext();

  useEffect(() => {
    async function fetchData() {
      const response = await getContact(contactID);
      setCurrentContact(response);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactID, lastContactUpdate]);

  return <Suspense fallback={<ShowContactSkeleton />}>{children}</Suspense>;
}
