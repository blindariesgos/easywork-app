import SlideOver from '@/components/SlideOver';
import React, { Suspense } from 'react';
import HeaderDataPoliza from '../../../components/show_poliza/HeaderDataPoliza';
import HeaderConsults from '../../../components/show_poliza/HeaderConsults';
import LoaderSpinner from '@/components/LoaderSpinner';
import FormPolicy from '../../../components/show_poliza/FormPolicy';
import PaymentsTable from '../../../components/show_poliza/payments/PaymentsTable';
import { Pagination } from '@/components/pagination/Pagination';
import ClaimsTable from '../../../components/show_poliza/claims/ClaimsTable';
import RefundTable from '../../../components/show_poliza/refunds/refundTable';
import InvoicesTable from '../../../components/show_poliza/InvoicesTable';
import VersionsTable from '../../../components/show_poliza/VersionsTable';
import CommissionsTable from '../../../components/show_poliza/CommissionsTable';

export default function PolicyDetails({ opt, id }) {
	return (
		<SlideOver
			openModal={true}
			colorTag={`bg-green-primary ${opt === "payments" && "w-28"}`}
			labelTag={opt}
			subLabelTag={opt == 'consult' ? 'consult' : null}
			samePage={`/sales/crm/contacts/contact/policies/${id}?show=true`}
			previousModalPadding="pl-24"
            mtTag="mt-20"
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
								<PaymentsTable noPolicy={id} />
							</div>
						)}
						{opt === 'claims' && (
							<div className="mt-4">
								<ClaimsTable noPolicy={id} />
							</div>
						)}
						{opt === 'refunds' && (
							<div className="mt-4">
								<RefundTable noPolicy={id} />
							</div>
						)}
						{opt === 'invoices' && (
							<div className="mt-4">
								<InvoicesTable noPolicy={id} />
							</div>
						)}
						{opt === 'versions' && (
							<div className="mt-4">
								<VersionsTable noPolicy={id} />
							</div>
						)}
						{opt === 'commissions' && (
							<div className="mt-4">
								<CommissionsTable noPolicy={id} />
							</div>
						)}
					</Suspense>
					{opt !== 'consult' && (
						<div className="absolute bottom-4">
							<Pagination totalPages={10} bgColor="bg-gray-300" />
						</div>
					)}
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
            {children} */}
				</div>
			</div>
		</SlideOver>
	);
}
