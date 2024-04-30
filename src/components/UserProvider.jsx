"use client";
import useCrmContext from "../context/crm";
import React, { useEffect } from "react";

export default function UserProvider({children, users}) {
    const { setCrmUsers } = useCrmContext();
    useEffect(() => {
        setCrmUsers(users);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users]);
  return (
    <>{children}</>
  )
}