'use client';
import Button from '../../../../../../../components/form/Button';
import { useOrderByColumn } from '../../../../../../../hooks/useOrderByColumn';
import { ChevronDownIcon, Cog8ToothIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTasks, useTasksDetete } from '../../../../../../../hooks/useCommon';
import { Pagination } from '../../../../../../../components/pagination/Pagination';
import SelectInput from '../../../../../../../components/form/SelectInput';
import SelectedOptionsTable from '../../../../../../../components/SelectedOptionsTable';
import AddColumnsTable from '../../../../../../../components/AddColumnsTable';
import LoaderSpinner from '@/components/LoaderSpinner';
import moment from 'moment';

export default function TableTask({ data }) {
	const { t } = useTranslation();
	const checkbox = useRef();
	const [ checked, setChecked ] = useState(false);
	const [ indeterminate, setIndeterminate ] = useState(false);
	const [ selectedTasks, setSelectedTasks ] = useState([]);
	const [ dataTask, setDataTask ] = useState();
	const { fieldClicked, handleSorting, orderItems } = useOrderByColumn([], data?.items);
	const { columnTable } = useTasks();
	const [loading, setLoading] = useState(false);
	const { optionsCheckBox } = useTasksDetete(selectedTasks, setSelectedTasks, setLoading)
	const [selectedColumns, setSelectedColumns] = useState(columnTable.filter(c=> c.check));

	useEffect(() => {
		if (data) setDataTask(data);
	}, [data])
	

	useEffect(
		() => {
			if (orderItems.length > 0) setDataTask({ items: orderItems, meta: data?.meta});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ orderItems ]
	);

	useLayoutEffect(
		() => {
			if (selectedTasks.length > 0){
				const isIndeterminate = selectedTasks.length > 0 && selectedTasks.length < dataTask?.items.length;
				setChecked(selectedTasks.length === dataTask?.items.length);
				setIndeterminate(isIndeterminate);
				checkbox.current.indeterminate = isIndeterminate;
			}
		},
		[ selectedTasks, dataTask ]
	);

	function toggleAll() {
		setSelectedTasks(checked || indeterminate ? [] : dataTask?.items);
		setChecked(!checked && !indeterminate);
		setIndeterminate(false);
	}

	return (
		<>
			{selectedColumns && selectedColumns.length > 0 && (
				<div className="flow-root">
				{loading && <LoaderSpinner/>}
					<div className="overflow-x-auto">
						<div className="inline-block min-w-full py-2 align-middle">
							<div className="relative sm:rounded-lg h-[60vh]">
								<table className="min-w-full rounded-md bg-gray-100 table-auto ">
									<thead className="text-sm bg-white drop-shadow-sm">
										<tr className=''>
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
													className={`min-w-[12rem] py-3.5 pr-3 text-sm font-medium text-primary cursor-pointer ${index === selectedColumns.length - 1  && "rounded-e-xl"}`}
													onClick={() => {
														handleSorting(column.row);
													}}
												>
													<div className="flex justify-center items-center gap-2">
														{column.name}
														<div>
															<ChevronDownIcon
																className={`h-6 w-6 text-primary ${fieldClicked.field ===
																	column.row && fieldClicked.sortDirection === 'desc'
																	? 'transform rotate-180'
																	: ''}`}
															/>
														</div>
													</div>
												</th>
											))}
										</tr>
									</thead>
									<tbody className="bg-gray-100">
										{selectedColumns.length > 0 && dataTask?.items?.length > 0 && dataTask?.items?.map((task, index) => (
											<tr
												key={index}
												className={clsx(
													selectedTasks.includes(task) ? 'bg-gray-200' : undefined,
													'hover:bg-indigo-100/40 cursor-default'
												)}
											>
												<td className=" px-7 sm:w-12 sm:px-6">
													{selectedTasks.includes(task) && (
														<div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
													)}
													<input
														type="checkbox"
														className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
														value={task.id}
														checked={selectedTasks.includes(task)}
														onChange={(e) =>
															setSelectedTasks(
																e.target.checked
																	? [ ...selectedTasks, task ]
																	: selectedTasks.filter((p) => p !== task)
															)}
													/>
												</td>										
												{selectedColumns.length > 0 && selectedColumns.map((column, index) => (
													<td className="ml-4 text-left py-5" key={index}>
														<div className="font-medium text-sm text-black hover:text-primary capitalize">
															{column.link ? (
																<Link href={`/tools/tool/tasks/task/${task.id}?show=true`} className="">
																	{task[column.row]}
																</Link>
															) : column.row === "responsible" ? (
																<div className="flex items-center justify-center">
																	<div className="font-medium text-black ">{task[column.row].length > 0 ? task[column.row].map(item => `${item.username}`).join(',') : ""}</div>
																</div>
															): column.row === "createdBy" ? (
																<div className="flex items-center justify-center">
																	<div className="font-medium text-black ">{task[column.row]?.username}</div>
																</div>
															): column.row === "deadline" ? task[column.row] ? (
																<div className='p-1 px-2 bg-blue-100 rounded-full text-sm'>
																	{moment(task[column.row]).format('DD/MM/YYYY hh:mm:ss A')}
																</div>
															): ""
															: column.row === "startTime" ? task[column.row] ? moment(task[column.row]).format('DD/MM/YYYY hh:mm:ss A') : ""
															: task[column.row]}
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
					<div className="w-full mt-2">
						<div className='flex justify-between items-center flex-wrap'>
							{selectedTasks.length > 0 && (
								<SelectedOptionsTable options={optionsCheckBox}/>
							)}
							<Pagination totalPages={dataTask?.meta?.totalPages || 0}/>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
