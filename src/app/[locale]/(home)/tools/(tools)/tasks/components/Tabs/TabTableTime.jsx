'use client';
import { CheckIcon, PencilIcon, PlusIcon, XMarkIcon } from '@heroicons/react/20/solid';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputDate from '@/components/form/InputDate';
import { FaCalendarDays } from 'react-icons/fa6';

export default function TabTableTime({ data }) {
	const time = data.data || [];
	const [ showIcon, setShowIcon ] = useState({});
	const { t } = useTranslation();

	//FUNCTIONS TO ADD TIME
	const schema = yup.object().shape({
		queues: yup.array().of(
			yup.object().shape(
				{
					// date: yup.object().required(),
					// time: yup.string().required(),
					// comment: yup.string().required(),
					// edit: yup.boolean()
				}
			)
		)
	});

	const { register, handleSubmit, control, getValues, setValue, watch } = useForm({
		defaultValues: {
			queues: [ ...time ]
		},
		resolver: yupResolver(schema)
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'queues'
	});

	console.log('fields', watch('queues'));
	/*-------------------------------------------------------------*/
	return (
		<div className="relative sm:rounded-lg p-2">
			<table className="min-w-full rounded-md bg-gray-100 table-auto">
				<thead className="text-xs bg-white drop-shadow-sm">
					<tr className="">
						<th scope="col" className={`py-3.5 text-xs font-normal text-black cursor-pointer rounded-s-xl`}>
							{t('tools:tasks:edit:table:date')}
						</th>
						<th scope="col" className={`py-3.5 text-xs font-normal text-black cursor-pointer`}>
							{t('tools:tasks:edit:table:created-by')}
						</th>
						<th scope="col" className={`py-3.5 text-xs font-normal text-black cursor-pointer`}>
							{t('tools:tasks:edit:table:time')}
						</th>
						<th
							scope="col"
							className={`min-w-[12rem] py-3.5 text-xs font-normal text-black cursor-pointer rounded-e-xl`}
						>
							{t('tools:tasks:edit:table:objections')}
						</th>
					</tr>
				</thead>
				<tbody className="bg-gray-100">
					{watch('queues') &&
						watch('queues').length > 0 &&
						watch('queues').map((time, index) => (
							<tr key={index} onMouseEnter={() => setShowIcon({ [index]: !showIcon[index] })}>
								<td className="text-xs py-2 text-center">
									<div>
										{time.edit ? (
											<Controller
												render={({ field: { value, onChange, ref, onBlur } }) => {
													return (
														<InputDate
															value={value}
															onChange={(e) => {
																e &&
																	setValue(
																		`queues.${index}.date`,
																		`${e.toLocaleDateString('en-US', {
																			month: '2-digit',
																			day: '2-digit',
																			year: 'numeric'
																		})} ${e.toLocaleTimeString()}`
																	);
															}}
															onBlur={onBlur}
															icon={
																<FaCalendarDays className="h-3 w-3 text-primary pr-4" />
															}
															time
														/>
													);
												}}
												name={`queues.${index}.date`}
												control={control}
												defaultValue=""
											/>
										) : (
											<div>{time.date}</div>
										)}
									</div>
								</td>
								<td className="text-xs py-2 text-center">{time.created}</td>
								<td className="text-xs py-2 flex justify-center">
									{time.edit ? (
										<div className="flex gap-1 items-center justify-center">
											<input
												{...register(`queues.${index}.hours`)}
												className="h-full w-10 rounded-md focus:ring-0 focus:outline-none ring-0 text-[10px] outline-none"
												type="number"
											/>
											<p className="text-xs">h</p>
											<input
												{...register(`queues.${index}.minutes`)}
												className="h-full w-10 rounded-md focus:ring-0 focus:outline-none ring-0 text-[10px] outline-none"
												type="number"
											/>
											<p className="text-xs">m</p>
											<input
												{...register(`queues.${index}.seconds`)}
												className="h-full w-10 rounded-md focus:ring-0 focus:outline-none ring-0 text-[10px] outline-none"
												type="number"
											/>
											<p className="text-xs">s</p>
										</div>
									) : (
										time.time
									)}
								</td>
								<td className="text-xs py-2 text-center">
									<div
										className={`flex ${time.comment
											? 'justify-between'
											: 'justify-end'} items-center w-full gap-2`}
									>
										{time.edit ? (
											<div className="w-full">
												<input
													{...register(`queues.${index}.comment`)}
													className="h-full w-full rounded-md focus:ring-0 focus:outline-none ring-0 text-[10px] outline-none"
													type="text"
													name={`queues.${index}.comment`}
												/>
											</div>
										) : (
											time.comment
										)}
										{showIcon[index] && (
											<div className="flex gap-2 items-center justify-end">
												{time.edit ? (
													<CheckIcon
														className="h-3 cursor-pointer text-gray-400"
														onClick={() => {
															watch('queues').length > 0 &&
																watch('queues').map((_, index) => {
																	setValue(`queues.${index}.edit`, false);
																});
															setValue(`queues.${index}.edit`, false);
														}}
													/>
												) : (
													<PencilIcon
														className="h-3 cursor-pointer text-gray-400"
														onClick={() => {
															watch('queues').length > 0 &&
																watch('queues').map((_, index) => {
																	setValue(`queues.${index}.edit`, false);
																});
															setValue(`queues.${index}.edit`, true);
														}}
													/>
												)}
												<XMarkIcon
													className="h-3 cursor-pointer text-gray-400"
													onClick={() => time.edit ? setValue(`queues.${index}.edit`, false) : remove(index)}
												/>
											</div>
										)}
									</div>
								</td>
							</tr>
						))}
					{!watch('queues')[watch('queues').length - 1].edit && (
						<tr className="">
							<td
								colSpan={4}
								className="flex gap-2 cursor-pointer text-xs items-center text-black font-medium py-2"
								onClick={() => {
									watch('queues').length > 0 &&
										watch('queues').map((_, index) => {
											setValue(`queues.${index}.edit`, false);
										});
									append({ edit: true });
								}}
							>
								<PlusIcon className="h-3 text-gray-400" />
								<p>{t('tools:tasks:edit:table:add')}</p>
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
