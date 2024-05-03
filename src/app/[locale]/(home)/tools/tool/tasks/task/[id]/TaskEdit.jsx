'use client';
import LoaderSpinner from '../../../../../../../../components/LoaderSpinner';
import IconDropdown from '../../../../../../../../components/SettingsButton';
import useAppContext from '../../../../../../../../context/app';
import { useTasks } from '../../../../../../../../hooks/useCommon';
import { Cog8ToothIcon, ExclamationTriangleIcon, FireIcon, PlusIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import OptionsTask from '../../components/OptionsTask';
import Button from '../../../../../../../../components/form/Button';
import ButtonMore from '../../components/ButtonMore';
import { BsStopwatchFill } from 'react-icons/bs';import TabsTaskEdit from '../../components/Tabs/TabsTaskEdit';
import moment from 'moment';
;

export default function TaskEdit({data}) {
	const params = useParams();
	const { id } = params;
	const { t } = useTranslation();
	const router = useRouter();
	const { lists } = useAppContext();
	const { settings } = useTasks();
	const [ loading, setLoading ] = useState(false);
	const [ check, setCheck ] = useState(true);
	const [ value, setValueText ] = useState(data ? data.description : '');
	return (
		<div className="flex flex-col h-screen relative w-full overflow-y-auto">
			{loading && <LoaderSpinner />}
			<div className="flex flex-col flex-1 bg-gray-600 opacity-100 shadow-xl text-black rounded-tl-[35px] rounded-bl-[35px] p-2 sm:p-4 h-full overflow-y-auto">
				<div className="flex justify-between items-center py-2">
					<h1 className="text-xl font-medium">{data?.name}</h1>
					<IconDropdown
						icon={<Cog8ToothIcon className="h-8 w-8 text-primary" aria-hidden="true" />}
						options={settings}
						width="w-44"
					/>
				</div>
				<div className="w-full flex gap-2 sm:gap-4 sm:flex-row flex-col h-full">
					<div className="w-full sm:w-9/12">
						<div className="bg-white rounded-lg">
							<div className="flex justify-between gap-2 items-center bg-gray-300 p-2">
								{/* <input
                                {...registerInputs("name")} 
                                placeholder={t('tools:tasks:new:description')}
                                className="bg-transparent border-none focus:ring-0 w-full placeholder:text-black"
                            /> */}
								<p className="text-xs">Tarea 12312 - {t('tools:tasks:edit:pending')}</p>
								<div className="flex gap-2 items-center">
									{/* <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-0"
                                    value={check}
                                    checked={check}
                                    onChange={(e) => setCheck(e.target.checked)}
                                /> */}
									<FireIcon className={`h-5 w-5 ${check ? 'text-red-500' : 'text-gray-200'}`} />
									<p className="text-sm">{t('tools:tasks:new:high')}</p>
								</div>
							</div>
							<div className="p-2 sm:p-4">
								<OptionsTask edit={data} setValueText={setValueText} value={value} disabled={data ? true : false}/>
							</div>
							<div className="flex items-end flex-col p-2 sm:p-4 gap-2">
								<div className="bg-blue-100 p-2 rounded-lg flex justify-between w-52">
									<p className="text-sm text-white">{t('tools:tasks:edit:contact')}:</p>
									<p className="text-sm text-white">Armando Medina</p>
								</div>
								<div className="bg-blue-100 p-2 rounded-lg flex justify-between w-52">
									<p className="text-sm text-white">{t('tools:tasks:edit:policy')}:</p>
									<p className="text-sm text-white">1587456621</p>
								</div>
							</div>
							<div className="p-2 sm:p-4">
								<div className="flex gap-2 flex-wrap">
									<Button
										label={t('tools:tasks:edit:init')}
										buttonStyle="green"
										className="px-3 py-2"
										fontSize="text-xs"
									/>
									<Button
										label={t('tools:tasks:edit:end')}
										buttonStyle="green"
										className="px-3 py-2"
										fontSize="text-xs"
									/>
									<ButtonMore />
									<div className="flex gap-2 items-center">
										<BsStopwatchFill className="h-4 w-4 text-easy-400" />
										<p className="text-easy-400 text-xs">00:00:00</p>
									</div>
								</div>
							</div>
						</div>
						<div className="mt-2 sm:mt-4 w-full relative">
                            <TabsTaskEdit/>
                        </div>
					</div>
					<div className="w-full sm:w-3/12 bg-white rounded-lg h-full">
						<div className="bg-primary rounded-lg p-2 text-center">
							<p className="text-white font-medium text-sm">
								{t('tools:tasks:edit:pending-since', { date: '10-10-10' })}
							</p>
						</div>
						<div className="p-2 sm:p-4">
							<div className="flex justify-between mb-2">
								<p className="text-sm text-black">{t('tools:tasks:edit:limit-date')}:</p>
								<p className="text-sm text-black">{data?.deadline ? moment(data?.deadline).format('DD/MM/YYYY hh:mm:ss A') : ""}</p>
							</div>
							<div className="w-ful bg-easy-300 rounded-md flex justify-center gap-2 p-1 my-3">
								<ExclamationTriangleIcon className="h-6 w-6 text-primary" />
								<p>{t('tools:tasks:edit:task-overdue')}</p>
							</div>
							<div className="flex justify-between mb-2">
								<p className="text-sm text-black">{t('tools:tasks:edit:created-the')}</p>
								<p className="text-sm text-black">{data?.createdAt ? moment(data?.createdAt).format('DD/MM/YYYY hh:mm:ss A') : ""}</p>
							</div>
							<div className="flex justify-between mb-2">
								<p className="text-sm text-black">{t('tools:tasks:edit:duration')}:</p>
								<p className="text-sm text-black">00:00:00</p>
							</div>
							<div className="mb-4">
								<p className="text-sm text-black">{t('tools:tasks:edit:created-by')}</p>
								<div className="flex gap-2 items-center mt-3">
									<Image
										className="h-12 w-12 rounded-full object-cover"
										width={36}
										height={36}
										src="https://images.unsplash.com/photo-1542309667-2a115d1f54c6?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
										alt=""
									/>
									<p className="text-base font-semibold text-black">Otilio Graterol</p>
								</div>
							</div>
							<div className="mb-4">
								<div className="flex justify-between">
									<div>
										<p className="text-sm text-black">{t('tools:tasks:edit:responsible')}</p>
									</div>
									<div className="cursor-pointer">
										<p className="text-xs text-black">{t('tools:tasks:edit:change')}</p>
									</div>
								</div>
								<div className="flex gap-2 items-center mt-3">
									<Image
										className="h-12 w-12 rounded-full object-cover"
										width={36}
										height={36}
										src="https://images.unsplash.com/photo-1542309667-2a115d1f54c6?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
										alt=""
									/>
									<p className="text-base font-semibold text-black">Otilio Graterol</p>
								</div>
							</div>
							<div className="mb-4">
								<p className="text-sm text-black">{t('tools:tasks:edit:participant')}</p>
								<div className="flex gap-2 items-center mt-3">
									<Image
										className="h-12 w-12 rounded-full object-cover"
										width={36}
										height={36}
										src="https://images.unsplash.com/photo-1542309667-2a115d1f54c6?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
										alt=""
									/>
									<p className="text-base font-semibold text-black">Otilio Graterol</p>
								</div>
							</div>
							<div className="mb-4">
								<p className="text-sm text-black">{t('tools:tasks:edit:obserbers')}</p>
								<div className="flex gap-2 items-center mt-3">
									<Image
										className="h-12 w-12 rounded-full object-cover"
										width={36}
										height={36}
										src="https://images.unsplash.com/photo-1542309667-2a115d1f54c6?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
										alt=""
									/>
									<p className="text-base font-semibold text-black">Otilio Graterol</p>
								</div>
							</div>
							<div className="mb-4">
								<p className="text-sm text-black">{t('tools:tasks:edit:tags')}</p>
								<div className="mt-2 flex gap-2 items-center cursor-pointer">
									<PlusIcon className="h-3 w-3" />
									<p className="text-xs text-black">{t('tools:tasks:edit:addTag')}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}