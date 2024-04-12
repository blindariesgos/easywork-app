"use client";
import SlideOver from "@/components/SlideOver";
import React from "react";
import CreateContact from "./CreateContact";
import useAppContext from "@/context/app";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CreateContactModal() {
  const { openModal, setOpenModal } = useAppContext();  
  
  return (
    <SlideOver colorTag="bg-yellow-100" labelTag="contact" samePage={`/sales/crm/contacts?page=1`}>
      <CreateContact />
    </SlideOver>
  );
}
