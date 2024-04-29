'use client';
import Button from '@/components/form/Button';
import { useOrderByColumn } from '@/hooks/useOrderByColumn';
import { ChevronDownIcon, Cog8ToothIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddColumnsTable from '../components/AddColumnsTable';
import { useTasks } from '@/hooks/useCommon';
import { Pagination } from '@/components/pagination/Pagination';
import SelectInput from '@/components/form/SelectInput';
import SelectedOptionsTable from '@/components/SelectedOptionsTable';
const tasks = [
	{
		id: 1,
		name: 'Correo Ventas del mes de agosto',
		activity: 'Enero, 28 05:40 pm',
		contact: 'No especificado',
		policy: 'No especificado',
		limitDate: '26/01/2024',
		createdBy: {
			name: 'Rosmer Campos',
			image:
				'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		},
		responsiblePerson: {
			name: 'Rosmer Campos',
			image:
				'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		}
	},
	{
		id: 1,
		name: 'Correo Ventas del mes de septiembre',
		activity: 'Enero, 28 10:40 am',
		contact: 'No especificado',
		policy: 'No especificado',
		limitDate: '28/01/2024',
		createdBy: {
			name: 'Rosmer Campos',
			image:
				'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		},

		responsiblePerson: {
			name: 'Rosmer Campos',
			image:
				'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		}
	},
	{
		id: 1,
		name: 'Actualizar póliza de seguro',
		activity: 'Enero, 29 09:40 am',
		contact: 'No especificado',
		policy: 'No especificado',
		limitDate: '30/01/2024',
		createdBy: {
			name: 'Rosmer Campos',
			image:
				'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		},
		responsiblePerson: {
			name: 'Rosmer Campos',
			image:
				'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		}
	}
	// More tasks...
];

export default function TableTask() {
	const { t } = useTranslation();
	const checkbox = useRef();
	const [ checked, setChecked ] = useState(false);
	const [ indeterminate, setIndeterminate ] = useState(false);
	const [ selectedTasks, setSelectedTasks ] = useState([]);
	const [ dataTask, setDataTask ] = useState(tasks);
	const { fieldClicked, handleSorting, orderItems } = useOrderByColumn([], dataTask);
	const { columnTable } = useTasks();
	const [selectedColumns, setSelectedColumns] = useState([]);

	useEffect(
		() => {
			if (orderItems.length > 0) setDataTask(orderItems);
		},
		[ orderItems ]
	);

	useLayoutEffect(
		() => {
			if (selectedTasks.length > 0){
				const isIndeterminate = selectedTasks.length > 0 && selectedTasks.length < dataTask.length;
				setChecked(selectedTasks.length === dataTask.length);
				setIndeterminate(isIndeterminate);
				checkbox.current.indeterminate = isIndeterminate;
			}
		},
		[ selectedTasks ]
	);

	function toggleAll() {
		setSelectedTasks(checked || indeterminate ? [] : dataTask);
		setChecked(!checked && !indeterminate);
		setIndeterminate(false);
	}

	useEffect(() => {
		if (columnTable) setSelectedColumns(columnTable.filter(c=> c.check));
	}, [])

	return (
		<>
			{selectedColumns && selectedColumns.length > 0 && (
				<div className="flow-root">
					<div className="overflow-x-auto">
						<div className="inline-block min-w-full py-2 align-middle">
							<div className="relative overflow-hidden sm:rounded-lg">
								<table className="min-w-full rounded-md bg-gray-100 table-auto">
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
										{selectedColumns.length > 0 && dataTask.map((task, index) => (
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
																<Link href={`/tools/tasks/task/${task.id}?show=true`} className="">
																	{task[column.row]}
																</Link>
															) : column.photo ? (
																<div className="flex items-center">
																	<div className="h-9 w-9 flex-shrink-0">
																		<Image
																			className="h-9 w-9 rounded-full"
																			width={36}
																			height={36}
																			src={task[column.row].image}
																			alt=""
																		/>
																	</div>
																	<div className="ml-4">
																		<div className="font-medium text-black ">{task[column.row].name}</div>
																	</div>
																</div>
															): task[column.row]}
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
					<div className="absolute bottom-0 w-full">
						<div className='flex justify-between items-center flex-wrap'>
							{selectedTasks.length > 0 && (
								<SelectedOptionsTable/>
							)}
							<Pagination totalPages={10} />
						</div>
					</div>
				</div>
			)}
		</>
	);
}
