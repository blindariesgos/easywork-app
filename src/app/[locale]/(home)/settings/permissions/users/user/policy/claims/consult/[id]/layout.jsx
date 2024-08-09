import NotFound from '../../../../../../../../../../../app/[locale]/not-found';
import React from 'react';
import ContactDetails from '../../../../[id]/ContactDetails';
import PoliciesDetails from '../../../../policies/[id]/PoliciesDetails';
import ClaimDetail from './ClaimDetail';

export default async function ClaimLayout({ params: { id }, children }) {
	if (!id) return <NotFound />;

	if (id)
		return (
			<div>
				{/* <ContactDetails id={id} contactInfo={null} />
				<PoliciesDetails id={id} /> */}
				<ClaimDetail id={id} />
			</div>
		);
}
