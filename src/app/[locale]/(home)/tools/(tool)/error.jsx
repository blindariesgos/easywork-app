"use client"; // Error components must be Client Components
import { handleApiError } from "../../../../../utils/api/errors";
import { useEffect, useRef } from "react";

export default function Error({ error, reset }) {
  const errorsDuplicated = useRef(false);
  useEffect(() => {
    handleApiError(error, errorsDuplicated);
  }, [error]);

  return <div />;
}
