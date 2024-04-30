'use client';
import { Menu, Transition } from '@headlessui/react';
import { PlusIcon, UserPlusIcon } from '@heroicons/react/20/solid';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

export default function ButtonMore() {
    const { t } = useTranslation();
    const options = [
        {
            id: 1,
            name: t("tools:tasks:edit:copy"),
            icon: DocumentDuplicateIcon
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
        }
    ]
    
	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="inline-flex w-full justify-center rounded-md text-xs font-medium text-black focus:outline-none bg-gray-200 py-2 px-3">
					{t('tools:tasks:edit:more')}
				</Menu.Button>
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
				<Menu.Items className="absolute right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50 w-36">
					<div className="px-1 py-1 ">
						{options.map((opt, index) => (
							<Menu.Item key={index}>
								{({ active }) => (
									<button
										className={`${active
											? ' text-white bg-green-primary'
											: 'text-gray-400'} group flex w-full items-center gap-1 rounded-md px-2 py-2 text-xs`}
									>
                                        <opt.icon className={`h-4 w-4 ${active ? "text-white" : "text-black"}`}/>
										{opt.name}
									</button>
								)}
							</Menu.Item>
						))}
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}
