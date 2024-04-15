'use client';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import { useOrderByColumn } from '@/hooks/useOrderByColumn';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '@/components/form/Button';
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

export default function RefundTable({ refunds: data, base, noPolicy }) {
	const { t } = useTranslation();
	const { fieldClicked, handleSorting, orderItems } = useOrderByColumn({}, people);
	const [ refunds, setRefunds ] = useState(people);
	const [ selectedRefunds, setSelectedRefunds ] = useState([]);
	const [ checked, setChecked ] = useState(false);
	const checkbox = useRef();
	const pathname = usePathname();

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
				checkbox.current.indeterminate = isIndeterminate;
			}
		},
		[ selectedRefunds ]
	);

	if (!refunds || refunds.length === 0) {
		return <PolizasEmpty add />;
	}

	return (
		<div className="h-full relative">
			<div className="flex justify-end">
				{selectedRefunds &&
				selectedRefunds.length > 0 && (
					<div className="flex h-12 items-center">
						<Button
							label={t('common:buttons:delete')}
							type="button"
							className="px-2 py-2"
							buttonStyle="primary"
							// onclick={() => deleteContact(selectedRefunds)}
						/>
					</div>
				)}
			</div>
			<div className="relative overflow-x-auto shadow-md rounded-xl">
				<table className="min-w-full rounded-md bg-gray-100">
					<thead className="text-sm bg-white drop-shadow-sm uppercase">
						<tr className="">
							<th
								scope="col"
								className="py-3.5 pl-4 pr-3 text-center text-sm font-medium text-gray-400 cursor-pointer rounded-s-xl"
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
								className="px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer"
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
						{refunds.map((poliza, index) => (
							<tr key={index}>
								<td className="whitespace-nowrap py-4 text-sm font-semibold text-black cursor-pointer hover:text-primary flex gap-4 items-center justify-center">
									{selectedRefunds.includes(poliza) && (
										<div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
									)}
									<input
										type="checkbox"
										className="h-4 w-4 rounded border-gray-300 text-primary focus:text-primary focus:ring-0"
										value={poliza.id}
										checked={selectedRefunds.includes(poliza)}
										onChange={(e) =>
											setSelectedRefunds(
												e.target.checked
													? [ ...selectedRefunds, poliza ]
													: selectedRefunds.filter((p) => p !== poliza)
											)}
									/>
									<Link
										href={`/sales/crm/contacts/contact/policy/refunds/consult/${poliza.claim}?show=true`}
									>
										{poliza.claim}
									</Link>
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
									{poliza.status}
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
									{poliza.date}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
