"use client";
import useCrmContext from "@/context/crm";
import { getContacts } from "@/lib/apis";
import { getApiError } from "@/utils/getApiErrors";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { toast } from 'react-toastify';

export default function Page() {
  const { setContacts, lastContactsUpdate } = useCrmContext();
  const searchParams = useSearchParams();
  const errorsDuplicated = useRef(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getContacts(searchParams.get('page')?.toString() || 0);
        setContacts(response);
      } catch (error) { 
        getApiError(error.message, errorsDuplicated)
      }
    }
    fetchData();
  }, [lastContactsUpdate, searchParams]);

  return <></>;
}
