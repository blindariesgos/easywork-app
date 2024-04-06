import SlideOver from "@/components/SlideOver";
import React, { Suspense } from "react";
import WrapperContext from "./component/WrapperContext";
import { getContact } from "@/lib/api";


async function useContact({ contactID }) {
  const response = await getContact(contactID);
  return response;
}

export const revalidate = 3600;

export default async function ContactLayout({
  children,
  general,
  polizas,
  documentos,
  actividades,
  reportes,
  params: { id },
}) {
  const contactInfo = await useContact({ contactID: id });

  return (
    <div>
      {children}
    
    </div>
  );
}
