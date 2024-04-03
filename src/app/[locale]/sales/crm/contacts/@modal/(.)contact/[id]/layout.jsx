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
    <SlideOver>
      <Suspense fallback={<div>Loading...</div>}>
      <WrapperContext
        general={general}
        polizas={polizas}
        actividades={actividades}
        reportes={reportes}
        documentos={documentos}
        contactInfo={contactInfo}
      />
      </Suspense>
    
    </SlideOver>
  );
}
