import React from "react";
import LeadDetails from "./LeadDetails";
// async function useContact({ contactID }) {
//   try {
//     const response = await getContactId(contactID); 
//     return response;    
//   } catch (error) {
//     throw new Error(JSON.stringify(error?.response?.data));
//   }
// }

export default async function PageContactId({ params: { id } }) {

  return <LeadDetails contactInfo={null} id={id}/>
}
