"use client";
import React from "react";
import UserDetails from "./UserDetails";
export default function PageContactId({ params: { id } }) {
  return <UserDetails id={id} />;
}
