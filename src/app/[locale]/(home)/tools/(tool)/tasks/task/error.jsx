"use client"; // Error components must be Client Components

import { handleApiError } from "../../../../../../../utils/api/errors";
import { redirect } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export default function Error({ error, reset }) {
  const errorsDuplicated = useRef(false);
  useEffect(() => {
    handleApiError(error, errorsDuplicated);
    redirect("/tools/tasks?page=1");
  }, [error]);

  return <div />;
}
