'use client';
import { ChevronDownIcon, DocumentTextIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import { useOrderByColumn } from '../../../../../../../../hooks/useOrderByColumn';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PolizasEmpty from '../show_contact/tab_polizas/PolizasEmpty';

const people = [
	{
		attach: 'archivo.doc',
		version: '0',
		renewal: '',
		dateStart: '10/10/2024',
		dateEnd: '10/10/2025'
	},
	{
		attach: 'archivo.doc',
		version: '1',
		renewal: '',
		dateStart: '10/10/2024',
		dateEnd: '10/10/2025'
	}
	// More people...
];

export default function VersionsTable({ versions: data, noPolicy, selectedVersions, setSelectedVersions }) {
	const { t } = useTranslation();
	const { fieldClicked, handleSorting, orderItems } = useOrderByColumn({}, people);
	const [ versions, setVersions ] = useState(people);
	const [ checked, setChecked ] = useState(false);
	const [ indeterminate, setIndeterminate ] = useState(false);
	const checkbox = useRef();

	useEffect(
		() => {
			setVersions(orderItems);
		},
		[ orderItems ]
	);

	useLayoutEffect(
		() => {
			if (checkbox.current) {
				const isIndeterminate =
					selectedVersions && selectedVersions.length > 0 && selectedVersions.length < versions.length;
				setChecked(selectedVersions.length === versions.length);
				setIndeterminate(isIndeterminate);
				checkbox.current.indeterminate = isIndeterminate;
			}
		},
		[ selectedVersions, versions ]
	);

	function toggleAll() {
		setSelectedVersions(checked || indeterminate ? [] : versions);
		setChecked(!checked && !indeterminate);
		setIndeterminate(false);
	}

	if (!versions || versions.length === 0) {
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
									{t('contacts:edit:policies:versions:table:attach')}
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
									handleSorting('version');
								}}
							>
								<div className="group inline-flex items-center">
									{t('contacts:edit:policies:versions:table:version')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'version' && fieldClicked.sortDirection === 'desc'
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
									handleSorting('renewal');
								}}
							>
								<div className="group inline-flex items-center">
									{t('contacts:edit:policies:versions:table:renewal')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'renewal' && fieldClicked.sortDirection === 'desc'
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
									handleSorting('dateStart');
								}}
							>
								<div className="group inline-flex items-center">
									{t('contacts:edit:policies:versions:table:date-init')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'dateStart' && fieldClicked.sortDirection === 'desc'
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
									handleSorting('dateEnd');
								}}
							>
								<div className="group inline-flex items-center">
									{t('contacts:edit:policies:versions:table:date-end')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'dateEnd' && fieldClicked.sortDirection === 'desc'
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
						{versions.map((version, index) => (
							<tr key={index}>
								<td className="relative px-7 sm:w-12 sm:px-6">
									{selectedVersions.includes(version) && (
										<div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
									)}
									<input
										type="checkbox"
										className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:text-primary focus:ring-0"
										value={version.id}
										checked={selectedVersions.includes(version)}
										onChange={(e) =>
											setSelectedVersions(
												e.target.checked
													? [ ...selectedVersions, version ]
													: selectedVersions.filter((p) => p !== version)
											)}
									/>
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-center">
									<div className="flex gap-2 px-2 hover:text-primary">
										<DocumentTextIcon className="h-5 w-5 text-primary" aria-hidden="true" />
										{version.attach}
									</div>
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
									{version.version}
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
									{version.renewal}
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
									{version.dateStart}
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-center">
									{version.dateEnd}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
