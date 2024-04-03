"use client";
import useAppContext from "@/context/app";
import { contactDetailTabs } from "@/lib/common";
import React from "react";
import ContactDetail from "../../../../components/ContactDetail";

export default function WrapperContext({
  general,
  polizas,
  actividades,
  reportes,
  documentos,
  contactInfo
}) {
  const { contactDetailTab } = useAppContext();


  return (
    <ContactDetail contactInfo={contactInfo}>
      {contactDetailTab === contactDetailTabs[0] && general}
      {contactDetailTab === contactDetailTabs[1] && polizas}
      {contactDetailTab === contactDetailTabs[2] && actividades}
      {contactDetailTab === contactDetailTabs[3] &&reportes}
      {contactDetailTab === contactDetailTabs[4] && documentos}
    </ContactDetail>
  );
}
