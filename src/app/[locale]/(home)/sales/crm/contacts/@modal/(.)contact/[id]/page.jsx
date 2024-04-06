import SlideOver from "@/components/SlideOver";

import React, { Suspense } from "react";

export default async function Page({ params: { id } }) {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return (
    <SlideOver openModal={true}>
      <Suspense fallback={<div>Loading...</div>}>
      {/* <WrapperContext
        general={general}
        polizas={polizas}
        actividades={actividades}
        reportes={reportes}
        documentos={documentos}
        // contactInfo={contactInfo}
      /> */}
      </Suspense>  
  </SlideOver>
  );
}
