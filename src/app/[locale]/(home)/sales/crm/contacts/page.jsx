"use client";
import useCrmContext from "../../../../../../context/crm";
import { getContacts } from "../../../../../../lib/apis";
import { handleApiError } from "../../../../../../utils/api/errors";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Page() {
  const { setContacts, lastContactsUpdate } = useCrmContext();
  const searchParams = useSearchParams();
  const errorsDuplicated = useRef(false);
  const isMounted = useRef(false);

  isMounted.current = true;

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const fetchData = async () => {
      try {
        const response = await getContacts(params.get("page")?.toString() || 1);
        setContacts(response);
      } catch (error) {
        handleApiError(error.message, errorsDuplicated);
      }
    };
    if (
      params.get("page") ||
      Number(params.get("page")) !== 0 ||
      lastContactsUpdate
    )
      fetchData();
    return () => {
      isMounted.current = false;
    };
  }, [lastContactsUpdate, searchParams, setContacts]);

  return <></>;
}
