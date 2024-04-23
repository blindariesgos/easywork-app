import React from 'react';
import CreateContactModal from '../components/create_contact/CreateContactModal';
import { getAddListContacts, getUsersContacts } from '@/lib/apis';
import { getApiError } from '@/utils/getApiErrors';

async function getUsersList() { 
  let usersLits;
  try {
    usersLits = await getUsersContacts();    
  } catch (error) {
    getApiError(error, null, true);
    
  }
	const lists = await getAddListContacts();
	return {
		users: usersLits,
		contactTypes: lists.contactTypes,
		contactSources: lists.contactSources
	};
}

export default async function page() {
	const lists = await getUsersList();
	return <CreateContactModal lists={lists} />;
}
