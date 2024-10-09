"use client";
import React from "react";
import ReceiptDetails from "../../components/ReceiptDetails";

export default function PageReceiptId({ params: { id } }) {
  return <ReceiptDetails id={id} />;
}
