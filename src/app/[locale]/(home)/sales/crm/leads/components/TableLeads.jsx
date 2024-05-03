'use client';
import { ChatBubbleBottomCenterIcon, ChevronDownIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid';
import { FaWhatsapp } from 'react-icons/fa6';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import useCrmContext from '../../../../../../../context/crm';
import { getURLContactPhoto } from '../../../../../../../lib/common';
import useAppContext from '../../../../../../../context/app';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Cog8ToothIcon } from '@heroicons/react/20/solid';
import Button from '../../../../../../../components/form/Button';
import { deleteContactId } from '../../../../../../../lib/apis';
import { getApiError } from '../../../../../../../utils/getApiErrors';
import { toast } from 'react-toastify';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { useOrderByColumn } from '../../../../../../../hooks/useOrderByColumn';
import { Pagination } from '../../../../../../../components/pagination/Pagination';
import AddColumnsTable from '../../../../../../../components/AddColumnsTable';
import { useLeads } from '../../../../../../../hooks/useCommon';
import SelectedOptionsTable from '../../../../../../../components/SelectedOptionsTable';

export default function TableLeads() {
	const params = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
	//   const currentPage = Number(params?.page) || 1;
	const { t } = useTranslation();
	const checkbox = useRef();
	const [ checked, setChecked ] = useState(false);
	const [ indeterminate, setIndeterminate ] = useState(false);
	const [ selectedLeads, setSelectedLeads ] = useState([]);
	const { columnTable } = useLeads()
	const [selectedColumns, setSelectedColumns] = useState(columnTable.filter(c=> c.check));
	// const sortFieltByColumn = {
	// 	name: [ 'name' ]
	// };
	const options = [
		{
			id: 1,
			name: t('common:buttons:delete'),
		}
	]


	const [leads, setLeads] = useState([
		{
			id: 1,
			name: 'Armando graterol',
			stages: {
				id: "etapa1",
				name: 'Contacto inicial'
			},
			date: '10/10/10',
			origin: 'Facebook'
		},
		{
			id: 2,
			name: 'Armando graterol',
			stages: {
				id: "etapa7",
				name: 'Cliente no interesado'
			},
			date: '10/10/10',
			origin: 'Facebook'
		}
	]);

	const { fieldClicked, handleSorting, orderItems } = useOrderByColumn([], leads);

	useEffect(
		() => {
			if (orderItems.length > 0) setLeads(orderItems);
		},
		[ orderItems ]
	);

	useLayoutEffect(
		() => {
			if (checkbox.current) {
				const isIndeterminate = selectedLeads && selectedLeads.length > 0 && selectedLeads.length < leads.length;
				setChecked(selectedLeads.length === leads.length);
				setIndeterminate(isIndeterminate);
				checkbox.current.indeterminate = isIndeterminate;
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[ selectedLeads, leads ]
	);

	function toggleAll() {
		setSelectedLeads(checked || indeterminate ? [] : leads);
		setChecked(!checked && !indeterminate);
		setIndeterminate(false);
	}

	const capitalizedText = (text) => {
		return text.charAt(0).toUpperCase() + text.slice(1);
	};

	const deleteContact = (lead) => {
		if (lead.length === 1) apiDelete(lead[0].id);
		if (lead.length > 1) {
			lead.map((cont) => apiDelete(cont.id));
		}
		router.push('/sales/crm/leads?page=1');
		toast.success(t('leads:delete:msg'));
		setSelectedLeads([]);
	};

	const apiDelete = async (id) => {
		// try {
		// 	const response = await deleteContactId(id);
		// } catch (err) {
		// 	getApiError(err.message);
		// }
	};

	

	if (leads && leads.length === 0) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="flex flex-col items-center space-y-3">
					<div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
						<svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
					</div>
					<p className="text-lg font-medium text-gray-400">{t('leads:table:not-data')}</p>
				</div>
			</div>
		);
	}

	const ColorDivisionsStages = ( data ) => {
		const colorGreen = ["etapa1", "etapa2", "etapa3", "etapa4"];
		const colorYellow = ["etapa5", "etapa6"];
		const colorRed = ["etapa7"];

		const getColorClass = (index) => {
			if (colorGreen.includes(data.id) && index <= colorGreen.indexOf(data.id)) {
				return 'bg-green-600';
			} else if (colorYellow.includes(data.id) && index > colorGreen.indexOf(data.id) && index <= colorYellow.indexOf(data.id)) {
				return 'bg-yellow-500';
			} else if (colorRed.includes(data.id) && index === data.id) {
				return 'bg-red-500';
			} else {
				return '';
			}
		};

		return (			
			<div className={`flex justify-center w-28 ${colorRed.includes(data?.id) ? "bg-red-500" : "bg-gray-200"}`}>
				{[0, 1, 2, 3, 4, 5, 6].map((index) => (
					<div
						key={index}
						className={`w-4 h-4 ${getColorClass(index)} border border-gray-400`}
					>
					</div>
				))}
			</div>
		);
	};

  

	return (
		<div className="flow-root relative h-full">
			<div className="overflow-x-auto">
				<div className="inline-block min-w-full py-2 align-middle sm:h-[40rem] overflow-y-auto h-full">
					<div className="relative overflow-hidden  sm:rounded-lg">
						<table className="min-w-full rounded-md bg-gray-100 table-auto">
							<thead className="text-sm bg-white drop-shadow-sm">
								<tr>
									<th scope="col" className="relative px-7 sm:w-12 sm:px-6 rounded-s-xl py-5">
										<input
											type="checkbox"
											className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
											ref={checkbox}
											checked={checked}
											onChange={toggleAll}
										/>
										<AddColumnsTable columns={columnTable} setSelectedColumns={setSelectedColumns}/>
									</th>									
									{selectedColumns.length > 0 && selectedColumns.map((column, index) => (
										<th
											key={index}
											scope="col"
											className={`min-w-[12rem] py-2 pr-3 text-sm font-medium text-gray-400 cursor-pointer ${index === selectedColumns.length - 1  && "rounded-e-xl"}`}
											onClick={() => {
											column.order &&
											handleSorting(column.order);
											}}
										>
											<div className="flex justify-center items-center gap-2">
											{column.name}
											<div>
												{column.order && (
													<ChevronDownIcon
														className={`h-6 w-6 text-primary ${fieldClicked.field ===
														column.order && fieldClicked.sortDirection === 'desc'
														? 'transform rotate-180'
														: ''}`}
													/>
												)}
											</div>
											</div>
										</th>
									))}
								</tr>
							</thead>
							<tbody className="bg-gray-100">
								{selectedColumns.length > 0 && leads.length > 0 &&
									leads.map((lead, index) => (
										<tr
											key={index}
											className={clsx(
												selectedLeads.includes(lead) ? 'bg-gray-200' : undefined,
												'hover:bg-indigo-100/40 cursor-default'
											)}
										>
											<td className=" px-7 sm:w-12 sm:px-6">
												{selectedLeads.includes(lead) && (
													<div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
												)}
												<input
													type="checkbox"
													className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
													value={lead.id}
													checked={selectedLeads.includes(lead)}
													onChange={(e) =>
														setSelectedLeads(
														e.target.checked
															? [ ...selectedLeads, lead ]
															: selectedLeads.filter((p) => p !== lead)
														)}
												/>
											</td>												
											{selectedColumns.length > 0 && selectedColumns.map((column, index) => (
												<td className="ml-4 text-center py-4" key={index}>
													<div className="font-medium text-sm text-black hover:text-primary capitalize">
														{column.link ? (
															<Link href={`/sales/crm/leads/lead/${lead.id}?show=true`} className="flex gap-3">
																<Image
																	className="h-8 w-8 rounded-full bg-zinc-200"
																	width={30}
																	height={30}
																	src={
																		lead.photo ?? "/img/avatar.svg"
																	}
																	alt=""
																/>
																{lead[column.row]}
															</Link>
														) : column.row === "stages" ? (
															<div className="flex items-center flex-col">
																<div className='flex justify-center'>{ColorDivisionsStages(lead.stages)}</div>
																<p className='mt-1 text-xs text-gray-200 font-semibold'>{lead.stages.name}</p>
															</div>
														): column.activities ? (
															<div className="flex gap-2">
																<button
																	type="button"
																	className="rounded-full bg-green-100 p-1 text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
																>
																	<FaWhatsapp className="h-4 w-4" aria-hidden="true" />
																</button>
																<button
																	type="button"
																	className="rounded-full bg-primary p-1 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
																>
																	<EnvelopeIcon
																		className="h-4 w-4"
																		aria-hidden="true"
																	/>
																</button>
																<button
																	type="button"
																	className="rounded-full bg-primary p-1 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
																>
																	<ChatBubbleBottomCenterIcon
																		className="h-4 w-4"
																		aria-hidden="true"
																	/>
																</button>
																<button
																	type="button"
																	className="rounded-full bg-primary p-1 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
																>
																	<PhoneIcon className="h-4 w-4" aria-hidden="true" />
																</button>
															</div>) 
														: column.row === "date" ? lead?.date ?? "N/A"
														: column.row === "origin" ? lead.origin
														: lead[column.row] || "-"}
													</div>
												</td>
											))}
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div className="sm:absolute sm:bottom-0 pt-4 sm:pt-0 w-full">
				<div className='flex justify-between items-center flex-wrap gap-4'>
				{selectedLeads.length > 0 && (
					<SelectedOptionsTable options={options}/>
				)}
				<Pagination 
					totalPages={10}
				/>
				</div>
			</div>
		</div>
	);
}
