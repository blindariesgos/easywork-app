"use client";
import React from "react";
import UserDetails from "./UserDetails";
import { useContact } from "@/src/lib/api/hooks/contacts";

export default function PageContactId({ params: { id } }) {
  return <UserDetails id={id} />;
}
