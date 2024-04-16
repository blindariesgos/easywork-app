import React from 'react';
import ContactDetails from '../../[id]/ContactDetails';
import PoliciesDetails from './PoliciesDetails';

// async function useContact({ contactID }) {
// 	const response = await getContact(contactID);
// 	return response;
// }

const wait3seconds = () => {
	return new Promise((resolve) => setTimeout(resolve, 5000));
};
export default async function Page({ params: { id } }) {
	await wait3seconds();
	//   const contactInfo = await useContact({ contactID: id });

	return (
		<div>
			{/* <ContactDetails contactInfo={null} id={id} /> */}
			<PoliciesDetails id={id} />
		</div>
	);
}
