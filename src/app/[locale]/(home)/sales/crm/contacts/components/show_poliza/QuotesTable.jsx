'use client';
import { ChevronDownIcon, DocumentTextIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import { useOrderByColumn } from '@/hooks/useOrderByColumn';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PolizasEmpty from '../show_contact/tab_polizas/PolizasEmpty';

const people = [
	{
		id: 1,
		attach: 'archivo.doc',
		amount: '2000',
		date: '10/10/2024',
		coin: 'Peso'
	},
	{
		id: 2,
		attach: 'archivo.doc',
		amount: '1000',
		date: '10/10/2024',
		coin: 'USD'
	}
	// More people...
];

export default function QuotesTable({ quotes: data, noPolicy, selectedQuotes, setSelectedQuotes }) {
	const { t } = useTranslation();
	const { fieldClicked, handleSorting, orderItems } = useOrderByColumn({}, people);
	const [ quotes, setQuotes ] = useState(people);
	const [ checked, setChecked ] = useState(false);
	const [ indeterminate, setIndeterminate ] = useState(false);
	const checkbox = useRef();

	useEffect(
		() => {
			setQuotes(orderItems);
		},
		[ orderItems ]
	);

	useLayoutEffect(
		() => {
			if (checkbox.current) {
				const isIndeterminate =
					selectedQuotes && selectedQuotes.length > 0 && selectedQuotes.length < quotes.length;
				setChecked(selectedQuotes.length === quotes.length);
				setIndeterminate(isIndeterminate);
				checkbox.current.indeterminate = isIndeterminate;
			}
		},
		[ selectedQuotes ]
	);

	function toggleAll() {
		setSelectedQuotes(checked || indeterminate ? [] : quotes);
		setChecked(!checked && !indeterminate);
		setIndeterminate(false);
	}

	if (!quotes || quotes.length === 0) {
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
									{t('contacts:edit:policies:quotes:table:attach')}
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
									handleSorting('date');
								}}
							>
								<div className="group inline-flex items-center">
									{t('polizas:edit:policies:quotes:table:date')}
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
									{t('polizas:edit:policies:quotes:table:amount')}
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
								className="px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer rounded-e-xl"
								onClick={() => {
									handleSorting('coin');
								}}
							>
								<div className="group inline-flex items-center">
									{t('polizas:edit:policies:quotes:table:coin')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'coin' && fieldClicked.sortDirection === 'desc'
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
						{quotes.map((quote, index) => (
							<tr key={index}>
								<td className="relative px-7 sm:w-12 sm:px-6">
									{selectedQuotes.includes(quote) && (
										<div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
									)}
									<input
										type="checkbox"
										className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:text-primary focus:ring-0"
										value={quote.id}
										checked={selectedQuotes.includes(quote)}
										onChange={(e) =>
											setSelectedQuotes(
												e.target.checked
													? [ ...selectedQuotes, quote ]
													: selectedQuotes.filter((p) => p !== quote)
											)}
									/>
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-center">
									<div className="flex gap-2 px-2 hover:text-primary">
										<DocumentTextIcon className="h-5 w-5 text-primary" aria-hidden="true" />
										{quote.attach}
									</div>
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
									{quote.date}
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
									{`$ ${quote.amount}`}
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
                                    {quote.coin}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
