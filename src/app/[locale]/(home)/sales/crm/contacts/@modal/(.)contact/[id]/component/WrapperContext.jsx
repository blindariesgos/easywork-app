"use client";
import React from "react";
// import ContactDetail from "../../../../components/ContactDetail";
// import useAppContext from "@/context/app";
// import { contactDetailTabs } from "@/lib/common";

export default function WrapperContext({
  general,
  polizas,
  actividades,
  reportes,
  documentos,
  contactInfo
}) {
  // const { contactDetailTab } = useAppContext();


  return (
    <div>
      {contactDetailTab === contactDetailTabs[0] && general}
      {contactDetailTab === contactDetailTabs[1] && polizas}
      {contactDetailTab === contactDetailTabs[2] && actividades}
      {contactDetailTab === contactDetailTabs[3] &&reportes}
      {contactDetailTab === contactDetailTabs[4] && documentos}
    </div>
  );
}
