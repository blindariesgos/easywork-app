'use client';
import SlideOver from '@/components/SlideOver';
import React, { Suspense, useState } from 'react';
import HeaderDataPoliza from '../../../../../components/show_poliza/HeaderDataPoliza';
import LoaderSpinner from '@/components/LoaderSpinner';
import HeaderConsult from '../../../../../components/show_poliza/payments/HeaderConsult';
import FormPayments from '../../../../../components/show_poliza/payments/FormPayment';
import DialogUploadFile from '../../../../../components/show_contact/tab_polizas/DialogUploadFile';

export default function PaymentDetail({ id }) {
    const [isOpen, setIsOpen] = useState(false);
	return (
		<SlideOver
			openModal={true}
			colorTag="bg-green-primary sm:w-28 w-auto"
			labelTag={'payments'}
			subLabelTag={'consult'}
			samePage={`/sales/crm/contacts/contact/policy/payments/${id}?show=true`}
			previousModalPadding="sm:pl-14 pl-10"
			mtTag="mt-20"
		>
			<div className="w-full h-screen flex flex-col flex-1 bg-gray-600 opacity-100 shadow-xl text-black overflow-hidden rounded-tl-[35px] rounded-bl-[35px] p-4 relative">
				<div className="flex flex-col flex-1 text-black overflow-hidden p-4">
					<HeaderDataPoliza />
					<HeaderConsult setAdd={setIsOpen}/>
					<Suspense fallback={<LoaderSpinner />}>
						<FormPayments />
					</Suspense>
				</div>
				<DialogUploadFile isOpen={isOpen} setIsOpen={setIsOpen} contactID={id} />
			</div>
		</SlideOver>
	);
}
