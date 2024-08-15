"use client";
import React from "react";
import ReceiptDetails from "../../components/ReceiptDetails";
import { useContact } from "@/src/lib/api/hooks/contacts";

export default function PageReceiptId({ params: { id } }) {
  return <ReceiptDetails id={id} />;
}
