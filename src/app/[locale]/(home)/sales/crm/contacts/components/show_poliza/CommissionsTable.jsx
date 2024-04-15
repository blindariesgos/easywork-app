'use client';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import { useOrderByColumn } from '@/hooks/useOrderByColumn';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/form/Button';
import PolizasEmpty from '../show_contact/tab_polizas/PolizasEmpty';

const people = [
	{
		id: 1,
		receipt: '00017892',
		amount: '2000',
		"date-commision": '10/10/2024'
	},
	{
		id: 2,
		receipt: '10017892',
		amount: '1000',
		"date-commision": '10/10/2024'
	}
	// More people...
];

export default function CommissionsTable({ commissions: data, base, noPolicy }) {
	const { t } = useTranslation();
	const { fieldClicked, handleSorting, orderItems } = useOrderByColumn({}, people);
	const [ commissions, setCommissions ] = useState(people);
	const [ selectedCommissions, setSelectedCommissions ] = useState([]);
	const [ checked, setChecked ] = useState(false);
	const checkbox = useRef();

	useEffect(
		() => {
			setCommissions(orderItems);
		},
		[ orderItems ]
	);

	useLayoutEffect(
		() => {
			if (checkbox.current) {
				const isIndeterminate =
					selectedCommissions && selectedCommissions.length > 0 && selectedCommissions.length < commissions.length;
				setChecked(selectedCommissions.length === commissions.length);
				checkbox.current.indeterminate = isIndeterminate;
			}
		},
		[ selectedCommissions ]
	);

	if (!commissions || commissions.length === 0) {
		return <PolizasEmpty add />;
	}

	return (
		<div className="h-full relative">
			<div className="flex justify-end">
				{/* {selectedCommissions &&
				selectedCommissions.length > 0 && (
					<div className="flex h-12 items-center">
						<Button
							label={t('common:buttons:delete')}
							type="button"
							className="px-2 py-2"
							buttonStyle="primary"
							// onclick={() => deleteContact(selectedCommissions)}
						/>
					</div>
				)} */}
			</div>
			<div className="relative overflow-x-auto shadow-md rounded-xl">
				<table className="min-w-full rounded-md bg-gray-100">
					<thead className="text-sm bg-white drop-shadow-sm uppercase">
						<tr className="">
							<th
								scope="col"
								className="py-3.5 pl-4 pr-3 text-center text-sm font-medium text-gray-400 cursor-pointer rounded-s-xl"
								onClick={() => {
									handleSorting('receipt');
								}}
							>
								<div className="group inline-flex items-center">
									{t('polizas:edit:policies:commissions:table:receipt')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'receipt' && fieldClicked.sortDirection === 'desc'
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
									{t('polizas:edit:policies:commissions:table:date-commision')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'date' && fieldClicked.sortDirection === 'desc'
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
									{t('polizas:edit:policies:commissions:table:amount')}
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
						</tr>
					</thead>
					<tbody className="bg-gray-100">
						{commissions.map((poliza, index) => (
							<tr key={index}>
								<td className="whitespace-nowrap py-4 text-sm font-semibold text-black cursor-pointer hover:text-primary flex gap-4 items-center justify-center">
									{selectedCommissions.includes(poliza) && (
										<div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
									)}
									<input
										type="checkbox"
										className="h-4 w-4 rounded border-gray-300 text-primary focus:text-primary focus:ring-0"
										value={poliza.id}
										checked={selectedCommissions.includes(poliza)}
										onChange={(e) =>
											setSelectedCommissions(
												e.target.checked
													? [ ...selectedCommissions, poliza ]
													: selectedCommissions.filter((p) => p !== poliza)
											)}
									/>
									<Link
										href={`/sales/crm/contacts/contact/policy/commissions/consult/${poliza.receipt}?show=true`}
									>
										{poliza.receipt}
									</Link>
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
									{poliza['date-commision']}
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
                                    {`$ ${poliza.amount}`}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
