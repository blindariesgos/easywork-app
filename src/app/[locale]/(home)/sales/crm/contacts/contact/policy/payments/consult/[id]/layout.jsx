import NotFound from '@/app/[locale]/not-found';
import React from 'react';
import ContactDetails from '../../../../[id]/ContactDetails';
import PoliciesDetails from '../../../../policies/[id]/PoliciesDetails';
import PaymentDetail from './PaymentDetail';

export default async function PaymentLayout({ params: { id }, children }) {
	if (!id) return <NotFound />;

	if (id)
		return (
			<div>
				{/* <ContactDetails id={id} contactInfo={null} />
				<PoliciesDetails id={id} /> */}
				{/* <PolicyDetails opt={"opt"} id={id} /> */}
				<PaymentDetail id={id} />
			</div>
		);
}
