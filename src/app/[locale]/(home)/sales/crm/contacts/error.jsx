"use client"; // Error components must be Client Components

import { handleApiError } from "../../../../../../utils/api/errors";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export default function Error({ error, reset }) {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const errorsDuplicated = useRef(false);
  useEffect(() => {
    handleApiError(error, errorsDuplicated);
    if (id) router.push("/sales/crm/contacts?page=1");
  }, [error, id, router]);

  return <div />;
}
