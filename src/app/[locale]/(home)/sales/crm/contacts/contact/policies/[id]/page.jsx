import React from 'react';
import PoliciesDetails from './PoliciesDetails';
import { getPolizaByContact } from '../../../../../../../../../lib/apis';
import { getApiError } from '../../../../../../../../../utils/getApiErrors';

async function getPoliza(id) {
	try {
		const data = await getPolizaByContact(id);
		return data;
	} catch (error) {
		getApiError(error, null, true);
	}
}

const wait3seconds = () => {
	return new Promise((resolve) => setTimeout(resolve, 5000));
};
export default async function Page({ params: { id } }) {
	await wait3seconds();
	const polizas = await getPoliza(id);

	return (
		<div>
			{/* <ContactDetails contactInfo={null} id={id} /> */}
			<PoliciesDetails id={id} polizas={polizas}/>
		</div>
	);
}
