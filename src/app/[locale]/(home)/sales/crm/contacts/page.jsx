"use client";
import useCrmContext from "@/context/crm";
import { getContacts } from "@/lib/apis";
import { getApiError } from "@/utils/getApiErrors";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Page() {
  const { setContacts, lastContactsUpdate } = useCrmContext();
  const searchParams = useSearchParams();
	const params = new URLSearchParams(searchParams);
  const errorsDuplicated = useRef(false);
  const isMounted = useRef(false);

  isMounted.current = true;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getContacts(params.get('page')?.toString() || 1);
          setContacts(response);
      } catch (error) { 
          getApiError(error.message, errorsDuplicated);
      }
    }
    if ((params.get('page') || Number(params.get('page')) !== 0) && isMounted.current) fetchData();
    return () => {
      isMounted.current = false;
    }
  }, []);  

  return <></>;
}
