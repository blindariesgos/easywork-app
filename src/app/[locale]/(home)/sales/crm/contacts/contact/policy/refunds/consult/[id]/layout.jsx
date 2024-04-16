import NotFound from '@/app/[locale]/not-found';
import React from 'react';
import ContactDetails from '../../../../[id]/ContactDetails';
import PoliciesDetails from '../../../../policies/[id]/PoliciesDetails';
import RefundDetail from './RefundDetail';

export default async function RefundLayout({ params: { id }, children }) {
	if (!id) return <NotFound />;

	if (id)
		return (
			<div>
				{/* <ContactDetails id={id} contactInfo={null} />
				<PoliciesDetails id={id} /> */}
				<RefundDetail id={id} />
			</div>
		);
}
