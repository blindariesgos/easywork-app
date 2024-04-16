'use client';
import SlideOver from '@/components/SlideOver';
import React, { Suspense, useState } from 'react';
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
import Button from '@/components/form/Button';
import { PlusIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import DialogUploadReceipt from '../../../components/show_poliza/payments/DialogUploadReceipt';
import DialogUploadClaim from '../../../components/show_poliza/claims/DialogUploadClaim';
import DialogUploadRefund from '../../../components/show_poliza/refunds/DialogUploadRefund';
import QuotesTable from '../../../components/show_poliza/QuotesTable';
import SchedulesTable from '../../../components/show_poliza/schedules/SchedulesTable';
import DialogUploadSchedule from '../../../components/show_poliza/schedules/DialogUploadSchedule';

export default function PolicyDetails({ opt, id }) {
	const { t } = useTranslation();
	const [ isOpen, setIsOpen ] = useState(false);
	const doNotAddFile = [ 'invoices', 'versions', 'commissions', 'quotes', 'consult' ];
	const [ selectedRows , setSelectedRows ] = useState([]);
	
	return (
		<SlideOver
			openModal={true}
			colorTag={`bg-green-primary ${opt === 'payments' && 'sm:w-28'}`}
			labelTag={opt}
			subLabelTag={opt == 'consult' ? 'consult' : null}
			samePage={`/sales/crm/contacts/contact/policies/${id}?show=true`}
		>
			<div className="w-full h-screen flex flex-col flex-1 bg-gray-600 opacity-100 shadow-xl text-black overflow-hidden rounded-tl-[35px] rounded-bl-[35px] p-4 relative">
				<div className="flex flex-col flex-1 text-black overflow-hidden p-4">
					<HeaderDataPoliza selectedRows={selectedRows}/>
					<div className='h-14 mb-8'>
						<HeaderConsults noPolicy={id} />
					</div>
					{!doNotAddFile.includes(opt) && (
						<div className="mt-8 flex justify-end">
							<Button
								label={
									opt === 'payments' ? (
										t('contacts:edit:policies:payments:consult:add')
									) : (
										t('contacts:edit:policies:add')
									)
								}
								buttonStyle="primary"
								className="px-3 py-2.5"
								icon={<PlusIcon className="w-5 h-5 text-white" />}
								onclick={() => setIsOpen(true)}
							/>
						</div>
					)}
					<Suspense fallback={<LoaderSpinner />}>
						{opt === 'consult' && (
							<div className="mt-4">
								<FormPolicy />
							</div>
						)}
						{opt === 'payments' && (
							<div className="mt-4">
								<PaymentsTable noPolicy={id} selectedPayments={selectedRows} setSelectedPayments={setSelectedRows}/>
								<DialogUploadReceipt isOpen={isOpen} setIsOpen={setIsOpen} contactID={id} />
							</div>
						)}
						{opt === 'claims' && (
							<div className="mt-4">
								<ClaimsTable noPolicy={id} selectedClaims={selectedRows} setSelectedClaims={setSelectedRows}/>
								<DialogUploadClaim isOpen={isOpen} setIsOpen={setIsOpen} contactID={id} />
							</div>
						)}
						{opt === 'refunds' && (
							<div className="mt-4">
								<RefundTable noPolicy={id} selectedRefunds={selectedRows} setSelectedRefunds={setSelectedRows}/>
								<DialogUploadRefund isOpen={isOpen} setIsOpen={setIsOpen} contactID={id} />
							</div>
						)}
						{opt === 'invoices' && (
							<div className="mt-4">
								<InvoicesTable noPolicy={id} setSelectedInvoices={setSelectedRows} selectedInvoices={selectedRows}/>
							</div>
						)}
						{opt === 'versions' && (
							<div className="mt-4">
								<VersionsTable noPolicy={id} setSelectedVersions={setSelectedRows} selectedVersions={selectedRows}/>
							</div>
						)}
						{opt === 'commissions' && (
							<div className="mt-4">
								<CommissionsTable noPolicy={id} setSelectedCommissions={setSelectedRows} selectedCommissions={selectedRows}/>
							</div>
						)}
						{opt === 'quotes' && (
							<div className="mt-4">
								<QuotesTable noPolicy={id} setSelectedQuotes={setSelectedRows} selectedQuotes={selectedRows}/>
							</div>
						)}
						{opt === 'schedules' && (
							<div className="mt-4">
								<SchedulesTable noPolicy={id} setSelectedSchedules={setSelectedRows} selectedSchedules={selectedRows}/>
								<DialogUploadSchedule isOpen={isOpen} setIsOpen={setIsOpen} contactID={id} />
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
