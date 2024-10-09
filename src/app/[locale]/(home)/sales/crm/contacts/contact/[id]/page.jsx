"use client";
import React from "react";
import ContactDetails from "./ContactDetails";

export default function PageContactId({ params: { id } }) {
  return <ContactDetails id={id} />;
}
