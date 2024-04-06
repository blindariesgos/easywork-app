"use client";
import SlideOver from "@/components/SlideOver";
import useAppContext from "@/context/app";
import useCrmContext from "@/context/crm";
import React from "react";
import WrapperContact from "./WrapperContact";
import ContactDetail from "../ContactDetail";
import ContactGeneral from "./ContactGeneral";
import { contactDetailTabs } from "@/lib/common";
import ContactPoliza from "./tab_polizas/ContactPoliza";
import WrapperPoliza from "./WrapperPoliza";

export default function ShowContactModal() {
  const { showContact, setShowContact, contactDetailTab } = useAppContext();
  const { currentContactID } = useCrmContext();

  return (
    <SlideOver openModal={showContact} setOpenModal={setShowContact} colorTag="bg-green-primary" labelTag="policy">
      <WrapperPoliza>
        
      </WrapperPoliza>
      {/* <ShowContact contactID={currentContact} /> */}
    </SlideOver>
  );
}
