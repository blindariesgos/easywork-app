"use client";
import SlideOver from "@/components/SlideOver";
import React from "react";
import CreateContact from "./CreateContact";

export default function CreateContactModal() {
  
  return (
    <SlideOver colorTag="bg-yellow-100" labelTag="contact" samePage={`/sales/crm/contacts?page=1`}>
      <CreateContact/>
    </SlideOver>
  );
}
