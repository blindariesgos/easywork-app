'use client';
import { ChevronDownIcon, CheckIcon, Cog8ToothIcon } from '@heroicons/react/20/solid';
import PolizasEmpty from './PolizasEmpty';
import { useTranslation } from 'react-i18next';
import { useOrderByColumn } from '../../../../../../../../../hooks/useOrderByColumn';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const people = [
	{
		noPoliza: '00017892',
		product: 'Profesional',
		company: 'gnp',
		estadoPoliza: 'Vigente',
		vigenciaDesde: '02-ENE-16',
		vigenciaHasta: '02-ENE-17',
		importePagar: '3,456.90',
		ramo: 'Vida'
	},
	{
		noPoliza: '10017892',
		product: 'Traciende',
		aseguradora: 'Front-end Developer',
		company: 'gnp',
		estadoPoliza: 'Pendiente',
		vigenciaDesde: '02-ENE-16',
		vigenciaHasta: '02-ENE-17',
		importePagar: '3,456.90',
		ramo: 'Autos'
	}
	// More people...
];

export default function ContactPolizaTable({ polizas: data, base, polizaID }) {
	const { t } = useTranslation();
	const { fieldClicked, handleSorting, orderItems } = useOrderByColumn({}, people);
	const [ polizas, setPolizas ] = useState(people);
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPolizas, setSelectedPolizas] = useState([]);

	useEffect(
		() => {
			setPolizas(orderItems);
		},
		[ orderItems ]
	);
  useLayoutEffect(() => {
    if (checkbox.current) {
      const isIndeterminate =
        selectedPolizas && selectedPolizas.length > 0 &&
        selectedPolizas.length < polizas.length;
      setChecked(selectedPolizas?.length === polizas?.length);
      setIndeterminate(isIndeterminate);
      checkbox.current.indeterminate = isIndeterminate;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPolizas]);

  function toggleAll() {
    setSelectedPolizas(checked || indeterminate ? [] : polizas);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

	if (!polizas || polizas.length === 0) {
		return <PolizasEmpty />;
	}

	return (
		<div className="h-full relative">
			<div className="relative overflow-x-auto shadow-md rounded-xl">
				<table className="min-w-full rounded-md bg-gray-100 table-auto">
					<thead className="text-sm bg-white drop-shadow-sm">
						<tr className="">
							<th scope="col" className="relative px-7 sm:w-12 sm:px-6 rounded-s-xl">
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
								className="py-3.5 pl-4 pr-3 text-center text-sm font-medium text-gray-400 cursor-pointer "
								onClick={() => {
									handleSorting('noPoliza');
								}}
							>
								<div className="group inline-flex items-center">
									{t('polizas:edit:policies:table:policy')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'noPoliza' && fieldClicked.sortDirection === 'desc'
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
									handleSorting('product');
								}}
							>
								<div className="group inline-flex items-center">
									{t('polizas:edit:policies:table:product')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'product' && fieldClicked.sortDirection === 'desc'
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
									handleSorting('company');
								}}
							>
								<div className="group inline-flex items-center">
									{t('polizas:edit:policies:table:company')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'company' && fieldClicked.sortDirection === 'desc'
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
									handleSorting('estadoPoliza');
								}}
							>
								<div className="group inline-flex items-center">
									{t('polizas:edit:policies:table:status')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'estadoPoliza' && fieldClicked.sortDirection === 'desc'
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
									handleSorting('vigenciaDesde');
								}}
							>
								<div className="group inline-flex items-center">
									{t('polizas:edit:policies:table:start')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'vigenciaDesde' && fieldClicked.sortDirection === 'desc'
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
									handleSorting('vigenciaHasta');
								}}
							>
								<div className="group inline-flex items-center">
									{t('polizas:edit:policies:table:expiration')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'vigenciaHasta' && fieldClicked.sortDirection === 'desc'
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
								className={`px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer ${base >
									0 && 'rounded-e-xl'}`}
								onClick={() => {
									handleSorting('importePagar');
								}}
							>
								<div className="group inline-flex items-center">
									{t('polizas:edit:policies:table:amount')}
									<span
										className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
											'importePagar' && fieldClicked.sortDirection === 'desc'
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
							{base === 0 && (
								<th
									scope="col"
									className="px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer rounded-e-xl"
									onClick={() => {
										handleSorting('ramo');
									}}
								>
									<div className="group inline-flex items-center">
										{t('polizas:edit:policies:table:branch')}
										<span
											className={`invisible ml-2 flex-none rounded text-primary group-hover:visible group-focus:visible ${fieldClicked.field ===
												'ramo' && fieldClicked.sortDirection === 'desc'
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
							)}
						</tr>
					</thead>
					<tbody className="bg-gray-100">
						{polizas.map((poliza, index) => (
							<tr key={index}>
								<td className="relative px-7 sm:w-12 sm:px-6">
								{selectedPolizas.includes(poliza) && (
									<div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
								)}
								<input
									type="checkbox"
									className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:text-primary"
									value={poliza.id}
									checked={selectedPolizas.includes(poliza)}
									onChange={(e) =>
									setSelectedPolizas(
										e.target.checked
										? [...selectedPolizas, poliza]
										: selectedPolizas.filter((p) => p !== poliza)
									)
									}
								/>
								</td>
								<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-black sm:pl-0 text-center cursor-pointer">
									<Link
										href={`/sales/crm/contacts/contact/policy/consult/${poliza.noPoliza}?show=true`}
									>
										<div className="flex gap-2 px-2 hover:text-primary">
											{poliza.noPoliza}
										</div>
									</Link>
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
									{poliza.product}
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
									{poliza.company}
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
									{poliza.estadoPoliza}
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-center">
									{poliza.vigenciaDesde}
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-center">
									{poliza.vigenciaHasta}
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-center">
									{`$ ${poliza.importePagar}`}
								</td>
								{base === 0 && (
									<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-center">
										{poliza.ramo}
									</td>
								)}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
