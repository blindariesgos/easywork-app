import SlideOver from "@/components/SlideOver";
import React, { Suspense } from "react";
import ContactDetail from "../../components/ContactDetail";
import { getContact } from "@/lib/api";
import CreateContact from "../../components/create_contact/CreateContact";
import useAppContext from "@/context/app";
import { getContactId } from "@/lib/apis";
async function useContact({ contactID }) {
  try {
    const response = await getContactId(contactID); 
    return response;    
  } catch (error) {
    throw new Error(JSON.stringify(error?.response?.data));
  }
}

export default async function Page({ params: { id } }) {
  const contactInfo = await useContact({ contactID: id });

  return (
    <SlideOver openModal={true} colorTag="bg-green-primary" labelTag="contact">
      <Suspense
        fallback={
          <div className="flex flex-col h-screen">
            <div className="flex flex-col flex-1 bg-zinc-200 opacity-100 shadow-xl text-zinc-800 overflow-hidden rounded-tl-3xl">
              </div>{" "}
          </div>
        }
      >
        <CreateContact edit={contactInfo} id={id} />
      </Suspense>
    </SlideOver>
  );
}
