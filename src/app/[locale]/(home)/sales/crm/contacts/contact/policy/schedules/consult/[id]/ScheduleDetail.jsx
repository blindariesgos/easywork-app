'use client';
import SlideOver from '@/components/SlideOver';
import React, { Suspense, useState } from 'react';
import HeaderDataPoliza from '../../../../../components/show_poliza/HeaderDataPoliza';
import LoaderSpinner from '@/components/LoaderSpinner';
import HeaderConsult from '../../../../../components/show_poliza/payments/HeaderConsult';
import DialogUploadFile from '../../../../../components/show_contact/tab_polizas/DialogUploadFile';
import FormSchedule from '../../../../../components/show_poliza/schedules/FormSchedule';

export default function ScheduleDetail({ id }) {
    const [isOpen, setIsOpen] = useState(false);
	return (
		<SlideOver
			openModal={true}
			colorTag="bg-green-primary w-auto"
			labelTag={'schedules'}
			subLabelTag={'consult'}
			samePage={`/sales/crm/contacts/contact/policy/schedules/${id}?show=true`}
		>
			<div className="w-full h-screen flex flex-col flex-1 bg-gray-600 opacity-100 shadow-xl text-black overflow-hidden rounded-tl-[35px] rounded-bl-[35px] p-4 relative">
				<div className="flex flex-col flex-1 text-black overflow-hidden p-4">
					<HeaderDataPoliza />
					<HeaderConsult setAdd={setIsOpen}/>
					<Suspense fallback={<LoaderSpinner />}>
						<FormSchedule/>
					</Suspense>
				</div>
				<DialogUploadFile isOpen={isOpen} setIsOpen={setIsOpen} contactID={id} />
			</div>
		</SlideOver>
	);
}
