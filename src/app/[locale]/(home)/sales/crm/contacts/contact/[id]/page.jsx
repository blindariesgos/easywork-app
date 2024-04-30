import React from 'react';
import ContactDetails from './ContactDetails';
import { getContactId } from '../../../../../../../../lib/apis';

export default async function PageContactId({ params: { id } }) {
	const contactInfo = await getContactId(id);

	return <ContactDetails contactInfo={contactInfo} id={id} />;
}
