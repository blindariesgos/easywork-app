import SlideOver from "@/components/SlideOver";
import React, { Suspense } from "react";
import ContactDetail from "../../components/ContactDetail";
import { getContact } from "@/lib/api";

async function useContact({ contactID }) {
  const response = await getContact(contactID);
  return response;
}

export default async function Page({ params: { id } }) {
  const contactInfo = await useContact({ contactID: id });

  return (
    <SlideOver>
      <Suspense
        fallback={
          <div className="flex flex-col h-screen">
            <div className="flex flex-col flex-1 bg-zinc-200 opacity-100 shadow-xl text-zinc-800 overflow-hidden rounded-tl-3xl">
              </div>{" "}
          </div>
        }
      >
        <ContactDetail contactInfo={contactInfo} />
      </Suspense>
    </SlideOver>
  );
}
