import SlideOver from "@/components/SlideOver";
import React, { Suspense } from "react";
import CreateContact from "../../components/create_contact/CreateContact";
import { getContactId } from "@/lib/apis";
import ContactDetails from "./ContactDetails";

// async function useContact({ contactID }) {
//   try {
//     const response = await getContactId(contactID); 
//     return response;    
//   } catch (error) {
//     throw new Error(JSON.stringify(error?.response?.data));
//   }
// }

export default async function PageContactId({ params: { id } }) {
  const contactInfo = await getContactId(id);

  return <ContactDetails contactInfo={contactInfo} id={id}/>
}
