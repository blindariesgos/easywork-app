'use client';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import { useOrderByColumn } from '@/hooks/useOrderByColumn';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PolizasEmpty from '../../show_contact/tab_polizas/PolizasEmpty';
import Link from 'next/link';

const people = [
	{
		id: 1,
		schedule: '00017892',
		date: '10/10/2024',
		status: "Liquidado"
	},
	{
		id: 2,
		schedule: '10017892',
		date: '10/10/2024',
		status: "Cancelado"
	}
];

export default function SchedulesTable({ schedules: data, noPolicy, selectedSchedules, setSelectedSchedules }) {
	const { t } = useTranslation();
	const { fieldClicked, handleSorting, orderItems } = useOrderByColumn({}, people);
	const [ schedules, setSchedules ] = useState(people);
	const [ checked, setChecked ] = useState(false);
	const [ indeterminate, setIndeterminate ] = useState(false);
	const checkbox = useRef();

	useEffect(
		() => {
			setSchedules(orderItems);
		},
		[ orderItems ]
	);

	useLayoutEffect(
		() => {
			if (checkbox.current) {
				const isIndeterminate =
					selectedSchedules && selectedSchedules.length > 0 && selectedSchedules.length < schedules.length;
				setChecked(selectedSchedules.length === schedules.length);
				setIndeterminate(isIndeterminate);
				checkbox.current.indeterminate = isIndeterminate;
			}
		},
		[ selectedSchedules ]
	);

	function toggleAll() {
		setSelectedSchedules(checked || indeterminate ? [] : schedules);
		setChecked(!checked && !indeterminate);
		setIndeterminate(false);
	}

	if (!schedules || schedules.length === 0) {
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
								className="px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer"
								onClick={() => {
									handleSorting('schedule');
								}}
							>
								<div className="group inline-flex items-center">
									{t('polizas:edit:policies:schedules:table:schedules')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'schedule' && fieldClicked.sortDirection === 'desc'
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
									handleSorting('date');
								}}
							>
								<div className="group inline-flex items-center">
									{t('polizas:edit:policies:schedules:table:date')}
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
								className="px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer rounded-e-xl"
								onClick={() => {
									handleSorting('status');
								}}
							>
								<div className="group inline-flex items-center">
									{t('polizas:edit:policies:schedules:table:status')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'status' && fieldClicked.sortDirection === 'desc'
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
						{schedules.map((schedule, index) => (
							<tr key={index}>								
								<td className="relative px-7 sm:w-12 sm:px-6">
									{selectedSchedules.includes(schedule) && (
										<div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
									)}
									<input
										type="checkbox"
										className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:text-primary focus:ring-0"
										value={schedule.id}
										checked={selectedSchedules.includes(schedule)}
										onChange={(e) =>
											setSelectedSchedules(
												e.target.checked
													? [ ...selectedSchedules, schedule ]
													: selectedSchedules.filter((p) => p !== schedule)
											)}
									/>
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center font-semibold cursor-pointer hover:text-primary">	
									<Link
										href={`/sales/crm/contacts/contact/policy/schedules/consult/${schedule.claim}?show=true`}
									>
									    {schedule.schedule}
									</Link>
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
									{schedule.date}
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
                                    {schedule.status}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
