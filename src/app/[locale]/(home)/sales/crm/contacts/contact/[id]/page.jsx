import React from "react";
import ContactDetails from "./ContactDetails";
import { getAddListContacts, getContactId, getUsersContacts } from "@/lib/apis";

async function getUsersList(id) {
	const usersLits = await getUsersContacts();
	const lists = await getAddListContacts();
  const contactInfo = await getContactId(id);
	return {
		users: usersLits,
		contactTypes: lists.contactTypes,
		contactSources: lists.contactSources,
    contactInfo
	};
}

export default async function PageContactId({ params: { id } }) {
  const lists = await getUsersList(id);

  return <ContactDetails contactInfo={lists.contactInfo} id={id} lists={lists}/>
}
