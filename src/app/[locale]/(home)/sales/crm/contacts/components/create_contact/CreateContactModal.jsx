"use client";
import SlideOver from "@/components/SlideOver";
import React from "react";
import CreateContact from "./CreateContact";
import useAppContext from "@/context/app";

export default function CreateContactModal() {
  const { openModal, setOpenModal } = useAppContext();
  return (
    <SlideOver openModal={openModal} colorTag="bg-yellow-100" labelTag="contact" samePage={`/sales/crm/contacts`}>
      <CreateContact />
    </SlideOver>
  );
}
