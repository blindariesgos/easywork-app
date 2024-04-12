import NotFound from '@/app/[locale]/not-found';
import SlideOver from '@/components/SlideOver';
import React, { Suspense } from 'react';
import HeaderDataPoliza from '../../../components/show_poliza/HeaderDataPoliza';
import HeaderConsults from '../../../components/show_poliza/HeaderConsults';
import FormPolicy from '../../../components/show_poliza/FormPolicy';
import LoaderSpinner from '@/components/LoaderSpinner';
import PaymentsTable from '../../../components/show_poliza/PaymentsTable';

export default async function PolicyIdLayout({ params: { slug }, children }) {
	const [ opt, id ] = slug;
	if (!opt || !id) return <NotFound />;

	if (opt)
		return (
			<SlideOver
				openModal={true}
				colorTag="bg-green-primary"
				labelTag={opt}
				subLabelTag={opt == 'consult' ? 'consult' : null}
				samePage={`/sales/crm/contacts/contact/policies/${id}?show=true`}
				previousModalPadding
			>
				<div className="w-full h-screen flex flex-col flex-1 bg-gray-600 opacity-100 shadow-xl text-black overflow-hidden rounded-tl-[35px] rounded-bl-[35px] p-4 relative">
					<div className="flex flex-col flex-1 text-black overflow-hidden p-4">
						<HeaderDataPoliza />
						<HeaderConsults noPolicy={id} />
						<Suspense fallback={<LoaderSpinner />}>
							{opt === 'consult' && (
								<div className="mt-4">
									<FormPolicy />
								</div>
							)}
							{opt === 'payments' && (
								<div className="mt-4">
									<PaymentsTable noPolicy={id}/>
								</div>
							)}
						</Suspense>
						{/* <div className="flex gap-2 items-center">
							<h1 className="text-xl">{id}</h1>
							<div>
								<PencilIcon className="h-3 w-3 text-gray-400" />
							</div>
						</div>
						<PolizasHeader contactID={id} selected="branch" />
					</div>
				<Suspense fallback={<LoadingContactId />}>
					<PolizasTab contactID={id} base={1} />
				</Suspense>
					{children}
					<div className="absolute bottom-0">
						<Pagination totalPages={10} bgColor="bg-gray-300" />
					</div> */}
					</div>
				</div>
			</SlideOver>
		);
}
