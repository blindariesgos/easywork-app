'use client';
import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import NewFields from './NewFields';

const AddFields = ({append, remove, fields}) => {
	const { t } = useTranslation();
	
	return (
		<Menu as="div" className="relative inline-block">
			<div>
				<Menu.Button className="inline-flex text-gray-60 bg-transparent text-xs font-semibold gap-2 mt-1.5">
					<PlusIcon className="h-4 w-4" />
					{t('contacts:filters:add-field')}
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
					className={`absolute left-0 mt-2 rounded-md bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 w-96`}
				>
                    <NewFields append={append} remove={remove} fields={fields}/>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

export default AddFields;
