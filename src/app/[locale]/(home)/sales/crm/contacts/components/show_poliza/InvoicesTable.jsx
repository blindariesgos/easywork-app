'use client';
import { ChevronDownIcon, DocumentTextIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import { useOrderByColumn } from '@/hooks/useOrderByColumn';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PolizasEmpty from '../show_contact/tab_polizas/PolizasEmpty';

const people = [
	{
		invoice: '00017892',
		attach: 'archivo.doc',
		amount: '3,456.90',
		coin: 'Pesos',
		date: '10/10/2024',
	},
	{
		invoice: '10017892',
		attach: 'archivo.doc',
		amount: '3,456.90',
		coin: 'Pesos',
		date: '10/10/2024',
	}
	// More people...
];

export default function InvoicesTable({ invoices: data, noPolicy, selectedInvoices, setSelectedInvoices }) {
	const { t } = useTranslation();
	const { fieldClicked, handleSorting, orderItems } = useOrderByColumn({}, people);
	const [ invoices, setInvoices ] = useState(people);
	const [ checked, setChecked ] = useState(false);
	const [ indeterminate, setIndeterminate ] = useState(false);
	const checkbox = useRef();

	useEffect(
		() => {
			setInvoices(orderItems);
		},
		[ orderItems ]
	);

	useLayoutEffect(
		() => {
			if (checkbox.current) {
				const isIndeterminate =
					selectedInvoices && selectedInvoices.length > 0 && selectedInvoices.length < invoices.length;
				setChecked(selectedInvoices.length === invoices.length);
				setIndeterminate(isIndeterminate);
				checkbox.current.indeterminate = isIndeterminate;
			}
		},
		[ selectedInvoices ]
	);
	
	function toggleAll() {
		setSelectedInvoices(checked || indeterminate ? [] : invoices);
		setChecked(!checked && !indeterminate);
		setIndeterminate(false);
	}

	if (!invoices || invoices.length === 0) {
		return <PolizasEmpty add />;
	}

	return (
		<div className="h-full relative">
			<div className="relative overflow-x-auto shadow-md rounded-xl">
				<table className="min-w-full rounded-md bg-gray-100 table-auto">
					<thead className="text-sm bg-white drop-shadow-sm uppercase">
						<tr className="">
							<th scope="col" className="relative w-10 rounded-s-xl">
								<input
									type="checkbox"
									className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
									ref={checkbox}
									checked={checked}
									onChange={toggleAll}
								/>
							</th>
							<th
								scope="col"
								className="py-3.5 pl-4 pr-3 text-center text-sm font-medium text-gray-400 cursor-pointer"
								onClick={() => {
									handleSorting('attach');
								}}
							>
								<div className="group inline-flex items-center">
									{t('contacts:edit:policies:invoices:table:attach')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'attach' && fieldClicked.sortDirection === 'desc'
											? 'transform rotate-180'
											: ''}`}
									>
										<ChevronDownIcon className="h-6 w-6" aria-hidden="true" />
									</span>
								</div>
							</th>
							<th
								scope="col"
								className="px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer"
								onClick={() => {
									handleSorting('invoice');
								}}
							>
								<div className="group inline-flex items-center">
									{t('contacts:edit:policies:invoices:table:invoice')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'invoice' && fieldClicked.sortDirection === 'desc'
											? 'transform rotate-180'
											: ''}`}
									>
										<ChevronDownIcon className="h-6 w-6" aria-hidden="true" />
									</span>
								</div>
							</th>
							<th
								scope="col"
								className="px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer"
								onClick={() => {
									handleSorting('amount');
								}}
							>
								<div className="group inline-flex items-center">
									{t('contacts:edit:policies:invoices:table:amount')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'amount' && fieldClicked.sortDirection === 'desc'
											? 'transform rotate-180'
											: ''}`}
									>
										<ChevronDownIcon
											className="invisible ml-2 h-6 w-6 flex-none rounded text-primary group-hover:visible group-focus:visible"
											aria-hidden="true"
										/>
									</span>
								</div>
							</th>
							<th
								scope="col"
								className="px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer"
								onClick={() => {
									handleSorting('coin');
								}}
							>
								<div className="group inline-flex items-center">
									{t('contacts:edit:policies:invoices:table:coin')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'datStart' && fieldClicked.sortDirection === 'desc'
											? 'transform rotate-180'
											: ''}`}
									>
										<ChevronDownIcon
											className="invisible ml-2 h-6 w-6 flex-none rounded text-primary group-hover:visible group-focus:visible"
											aria-hidden="true"
										/>
									</span>
								</div>
							</th>
							<th
								scope="col"
								className="px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer rounded-e-xl"
								onClick={() => {
									handleSorting('date');
								}}
							>
								<div className="group inline-flex items-center">
									{t('contacts:edit:policies:invoices:table:date')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'date' && fieldClicked.sortDirection === 'desc'
											? 'transform rotate-180'
											: ''}`}
									>
										<ChevronDownIcon
											className="invisible ml-2 h-6 w-6 flex-none rounded text-primary group-hover:visible group-focus:visible"
											aria-hidden="true"
										/>
									</span>
								</div>
							</th>
						</tr>
					</thead>
					<tbody className="bg-gray-100">
						{invoices.map((invoice, index) => (
							<tr key={index}>			
								<td className="relative px-7 sm:w-12 sm:px-6">
									{selectedInvoices.includes(invoice) && (
										<div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
									)}
									<input
										type="checkbox"
										className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:text-primary focus:ring-0"
										value={invoice.id}
										checked={selectedInvoices.includes(invoice)}
										onChange={(e) =>
											setSelectedInvoices(
												e.target.checked
													? [ ...selectedInvoices, invoice ]
													: selectedInvoices.filter((p) => p !== invoice)
											)}
									/>
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-center">
									<div className="flex gap-2 px-2 hover:text-primary">
										<DocumentTextIcon className="h-5 w-5 text-primary" aria-hidden="true" />
										{invoice.attach}
									</div>
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
									{invoice.invoice}
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
									{invoice.amount}
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
									{invoice.coin}
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-center">
									{invoice.date}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
