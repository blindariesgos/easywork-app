'use client';
import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';

const FilterPanel = () => {
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
		});
		setContacts(updateSelection);
	};

	return (
		<Menu as="div" className="relative inline-block">
			<div>
				<Menu.Button className="inline-flex w-full bg-primary hover:bg-easy-500 text-white rounded-md text-[10px] px-1.5 py-1 gap-1">
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
					className={`absolute right-0 mt-2 rounded-md bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 w-96`}
				>
					<div className="">
						<div className="flex gap-4 w-full h-10">
							<MagnifyingGlassIcon
								className="pointer-events-none absolute inset-y-0 left-2 h-full w-5 text-primary"
								aria-hidden="true"
							/>
							<input
								id="search-field"
								className=" w-full h-10 my-auto rounded-md border-0 py-0 pl-8 pr-2 text-black placeholder:text-primary focus:ring-0 sm:text-sm bg-gray-100 font-medium"
								placeholder={t('common:search')}
								type="search"
								name="search"
							/>
						</div>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

export default FilterPanel;
