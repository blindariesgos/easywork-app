'use client';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import { useOrderByColumn } from '@/hooks/useOrderByColumn';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import PolizasEmpty from '../../show_contact/tab_polizas/PolizasEmpty';

const people = [
	{
		id: 1,
		claim: '00017892',
		status: 'Liquidado',
		date: '10/10/2024'
	},
	{
		id: 2,
		claim: '10017892',
		status: 'Cancelado',
		date: '10/10/2024'
	}
	// More people...
];

export default function RefundTable({ refunds: data, noPolicy, selectedRefunds, setSelectedRefunds }) {
	const { t } = useTranslation();
	const { fieldClicked, handleSorting, orderItems } = useOrderByColumn({}, people);
	const [ refunds, setRefunds ] = useState(people);
	const [ checked, setChecked ] = useState(false);
	const [ indeterminate, setIndeterminate ] = useState(false);
	const checkbox = useRef();

	useEffect(
		() => {
			setRefunds(orderItems);
		},
		[ orderItems ]
	);

	useLayoutEffect(
		() => {
			if (checkbox.current) {
				const isIndeterminate =
					selectedRefunds && selectedRefunds.length > 0 && selectedRefunds.length < refunds.length;
				setChecked(selectedRefunds.length === refunds.length);
				setIndeterminate(isIndeterminate);
				checkbox.current.indeterminate = isIndeterminate;
			}
		},
		[ selectedRefunds ]
	);
	
	function toggleAll() {
		setSelectedRefunds(checked || indeterminate ? [] : refunds);
		setChecked(!checked && !indeterminate);
		setIndeterminate(false);
	}

	if (!refunds || refunds.length === 0) {
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
									handleSorting('refund');
								}}
							>
								<div className="group inline-flex items-center">
									{t('polizas:edit:policies:refunds:table:refund')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'refund' && fieldClicked.sortDirection === 'desc'
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
									handleSorting('status');
								}}
							>
								<div className="group inline-flex items-center">
									{t('polizas:edit:policies:refunds:table:status')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'status' && fieldClicked.sortDirection === 'desc'
											? 'transform rotate-180'
											: ''}`}
									>
										<ChevronDownIcon className="h-6 w-6" aria-hidden="true" />
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
									{t('polizas:edit:policies:refunds:table:date')}
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
						{refunds.map((refund, index) => (
							<tr key={index}>
								<td className="relative px-7 sm:w-12 sm:px-6">
									{selectedRefunds.includes(refund) && (
										<div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
									)}
									<input
										type="checkbox"
										className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:text-primary focus:ring-0"
										value={refund.id}
										checked={selectedRefunds.includes(refund)}
										onChange={(e) =>
											setSelectedRefunds(
												e.target.checked
													? [ ...selectedRefunds, refund ]
													: selectedRefunds.filter((p) => p !== refund)
											)}
									/>
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center font-semibold cursor-pointer hover:text-primary">	
									<Link
										href={`/sales/crm/contacts/contact/policy/refunds/consult/${refund.claim}?show=true`}
									>
										{refund.claim}
									</Link>
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
									{refund.status}
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
									{refund.date}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
