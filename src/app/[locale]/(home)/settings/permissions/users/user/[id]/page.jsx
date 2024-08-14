"use client";
import React from "react";
import ContactDetails from "./UserDetails";
import { useContact } from "@/src/lib/api/hooks/contacts";

export default function PageContactId({ params: { id } }) {
  return <ContactDetails id={id} />;
}
