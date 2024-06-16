'use client';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { ChevronDownIcon, PlusIcon, UserPlusIcon } from '@heroicons/react/20/solid';
import { DocumentDuplicateIcon, PencilIcon } from '@heroicons/react/24/outline';
import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ButtonMore({ setOpenEdit, openEdit, data }) {
    const { t } = useTranslation();
    const [options, setOptions] = useState([
        {
            id: 1,
            name: t("tools:tasks:edit:copy"),
            icon: DocumentDuplicateIcon,
			onclick: () => setOpenEdit({mode: "copy"})
        },
        {
            id: 2,
            name: t("tools:tasks:edit:subtask"),
            icon: PlusIcon
        },
        {
            id: 2,
            name: t("tools:tasks:edit:delegate"),
            icon: UserPlusIcon
        },
    ])

	useEffect(() => {
		if (data && !data.isCompleted ){
			setOptions([...options, {
				id: 32,
				name: t("tools:tasks:edit:edit"),
				icon: PencilIcon,
				onclick: () => setOpenEdit({mode: "edit"})
			}]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])
	
    
	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<MenuButton className="flex items-center justify-center w-full rounded-md text-xs font-medium text-black focus:outline-none bg-gray-200 py-2 px-3">
					{t('tools:tasks:edit:more')}
					<ChevronDownIcon className="ml-1 h-5 w-5 text-gray-800" />
				</MenuButton>
			</div>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<MenuItems className="absolute left-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50 w-36">
					<div className="px-1 py-1 ">
						{options.map((opt, index) => (
							<MenuItem key={index}>
								{() => (
									<button
										onClick={opt.onclick}
										className={`group flex w-full text-gray-400 data-[focus]:bg-primary data-[focus]:text-white items-center gap-1 rounded-md px-2 py-2 text-xs`}
									>
                                        <opt.icon className={`h-4 w-4 data-[focus]:text-white text-black"}`}/>
										{opt.name}
									</button>
								)}
							</MenuItem>
						))}
					</div>
				</MenuItems>
			</Transition>
		</Menu>
	);
}
