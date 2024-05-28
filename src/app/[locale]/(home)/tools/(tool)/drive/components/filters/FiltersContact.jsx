'use client';
import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import FormFilters from './FormFilters';

const FiltersContact = () => {
	const { t } = useTranslation();
	const [ contacts, setContacts ] = useState([
		{
			id: 1,
			name: t('contacts:filters:my-contact'),
			selected: false
		},
		{
			id: 2,
			name: t('contacts:filters:all-contact'),
			selected: false
		}
	]);

	const handleSelected = (id) => {
		const updateSelection = contacts.map((cont) => {
			return cont.id === id ? { ...cont, selected: !cont.selected } : { ...cont, selected: false };
		});;
		setContacts(updateSelection);
	};

	return (
		<Menu as="div" className="relative inline-block">
			<div>
				<Menu.Button className="inline-flex w-full bg-primary hover:bg-easy-500 text-white rounded-md text-xs px-1.5 py-1 gap-1">
					{t('contacts:filters:name')}
					<ChevronDownIcon className="h-4 w-4 -rotate-180" />
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
				<Menu.Items
					className={`absolute left-0 mt-2 rounded-md bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 w-fit`}
				>
					<div className="p-4">
						<div className="flex gap-4 flex-col sm:flex-row">
							<div className="bg-gray-150 flex flex-col w-full sm:w-40 px-4 py-2 rounded-md relative">
								<p className="text-xs text-gray-60 text-center">{t('contacts:filters:name')}</p>
								<div className="mt-4 flex flex-col gap-2 mb-14">
									{contacts &&
										contacts.map((cont, index) => (
											<div
												key={index}
												className="cursor-pointer"
												onClick={() => handleSelected(cont.id)}
											>
												<p
													className={`text-sm uppercase  ${cont.selected
														? 'text-primary font-medium'
														: 'text-gray-60'}`}
												>
													{cont.name}
												</p>
											</div>
										))}
								</div>
								<div className="absolute bottom-2">
									<div className="flex gap-2 cursor-pointer items-center">
										<PlusIcon className="h-3 w-3 text-gray-60" />
										<p className="text-xs uppercase text-gray-60">{t('contacts:filters:save')}</p>
									</div>
								</div>
							</div>
                            <FormFilters/>
						</div>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

export default FiltersContact;
