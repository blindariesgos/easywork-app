"use client";
import React from "react";
import CreateContact from "./CreateContact";
import SlideOver from "@/src/components/SlideOver";

export default function CreateContactModal() {
  
  return (
    <SlideOver colorTag="bg-easywork-main" labelTag="contact" samePage={`/sales/crm/contacts?page=1`}>
      <CreateContact/>
    </SlideOver>
  );
}
