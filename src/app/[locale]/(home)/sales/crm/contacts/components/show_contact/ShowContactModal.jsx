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
import CreateContact from "../create_contact/CreateContact";

export default function ShowContactModal() {
  const { showContact, setShowContact, contactDetailTab } = useAppContext();
  const { currentContactID } = useCrmContext();

  return (
    <SlideOver openModal={showContact} setOpenModal={setShowContact} colorTag="bg-green-primary" labelTag="contact">
      <WrapperContact contactID={currentContactID}>
        {/* <ContactDetail>
          {contactDetailTab === contactDetailTabs[0] && <ContactGeneral />}
          {contactDetailTab === contactDetailTabs[1] && (
            <ContactPoliza contactID={currentContactID} />
          )}
        </ContactDetail> */}
        <CreateContact edit/>
      </WrapperContact>
      {/* <ShowContact contactID={currentContact} /> */}
    </SlideOver>
  );
}
