'use client';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import { useOrderByColumn } from '../../../../../../../../../hooks/useOrderByColumn';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import PolizasEmpty from '../../show_contact/tab_polizas/PolizasEmpty';

const people = [
	{
		id: 1,
		claim: '00017892',
		case: '330017892',
		status: 'Liquidado',
		date: '10/10/2024'
	},
	{
		id: 2,
		claim: '10017892',
		case: '3s30017892',
		status: 'Cancelado',
		date: '10/10/2024'
	}
	// More people...
];

export default function ClaimsTable({ claims: data, noPolicy, selectedClaims, setSelectedClaims }) {
	const { t } = useTranslation();
	const { fieldClicked, handleSorting, orderItems } = useOrderByColumn({}, people);
	const [ claims, setClaims ] = useState(people);
	const [ checked, setChecked ] = useState(false);
	const [ indeterminate, setIndeterminate ] = useState(false);
	const checkbox = useRef();

	useEffect(
		() => {
			setClaims(orderItems);
		},
		[ orderItems ]
	);

	useLayoutEffect(
		() => {
			if (checkbox.current) {
				const isIndeterminate =
					selectedClaims && selectedClaims.length > 0 && selectedClaims.length < claims.length;
				setChecked(selectedClaims.length === claims.length);
				setIndeterminate(isIndeterminate);
				checkbox.current.indeterminate = isIndeterminate;
			}
		},
		[ selectedClaims, claims ]
	);

	function toggleAll() {
		setSelectedClaims(checked || indeterminate ? [] : claims);
		setChecked(!checked && !indeterminate);
		setIndeterminate(false);
	}

	if (!claims || claims.length === 0) {
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
									handleSorting('claim');
								}}
							>
								<div className="group inline-flex items-center">
									{t('polizas:edit:policies:claims:table:claim')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'claim' && fieldClicked.sortDirection === 'desc'
											? 'transform rotate-180'
											: ''}`}
									>
										<ChevronDownIcon className="h-6 w-6" aria-hidden="true" />
									</span>
								</div>
							</th>
							<th
								scope="col"
								className="py-3.5 pl-4 pr-3 text-center text-sm font-medium text-gray-400 cursor-pointer"
								onClick={() => {
									handleSorting('case');
								}}
							>
								<div className="group inline-flex items-center">
									{t('polizas:edit:policies:claims:table:case')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'case' && fieldClicked.sortDirection === 'desc'
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
									{t('polizas:edit:policies:claims:table:status')}
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
									{t('polizas:edit:policies:claims:table:date')}
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
						{claims.map((claim, index) => (
							<tr key={index}>
								<td className="relative px-7 sm:w-12 sm:px-6">
									{selectedClaims.includes(claim) && (
										<div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
									)}
									<input
										type="checkbox"
										className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:text-primary focus:ring-0"
										value={claim.id}
										checked={selectedClaims.includes(claim)}
										onChange={(e) =>
											setSelectedClaims(
												e.target.checked
													? [ ...selectedClaims, claim ]
													: selectedClaims.filter((p) => p !== claim)
											)}
									/>
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center font-semibold cursor-pointer hover:text-primary">	
									<Link
										href={`/sales/crm/contacts/contact/policy/claims/consult/${claim.claim}?show=true`}
									>
										{claim.claim}
									</Link>
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
									{claim.case}
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
									{claim.status}
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
									{claim.date}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
