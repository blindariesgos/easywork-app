import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { PlusIcon } from '@heroicons/react/20/solid';
import Tooltip from '../../../../../../../components/Tooltip';

export default function AddListSeLectingText({ text, fields, setValue, append, value, getValues, watch, setOpenList }) {
	const { t } = useTranslation();

	const onAddValue = (index) => {
		const existingSubItems = watch(`items.${index}.subItems`);
		if (existingSubItems.some((subItem, index) => subItem.name === '')) {
			const indexNameEmpty = existingSubItems.findIndex((subItem) => subItem.name === '');
			const arrayDataCorrect = watch(`items.${index}.subItems`).filter((_, index) => index !== indexNameEmpty);
			setValue(`items.${index}.subItems`, arrayDataCorrect);
		}
		setValue(`items.${index}.subItems`, [
			...getValues(`items.${index}.subItems`),
			{ name: value, value: false, empty: false }
		]);
	};
	
	return (
		<div>
			<Menu as="div" className="relative inline-block text-left">
				<div>
					<Menu.Button className="focus:ring-0 text-sm">
						{value !== '' ? (
							<div
								onClick={() => {
									value !== '' && fields.length === 0 &&
										append({
											name: `${t('tools:tasks:new:verification-list')} #${fields.length + 1}`,
											subItems: [ { name: value, value: false, empty: false } ]
										});
									value !== '' &&  fields.length === 0 && setOpenList(true);
								}}
							>
								{text}
							</div>
						) : (
							<Tooltip position='top' text={t('tools:tasks:new:empty-value')}>
								{text}
							</Tooltip>
						)}
					</Menu.Button>
				</div>
				{value !== '' && fields.length > 0 && (
					<Transition
						as={Fragment}
						enter="transition ease-out duration-100"
						enterFrom="transform opacity-0 scale-95"
						enterTo="transform opacity-100 scale-100"
						leave="transition ease-in duration-75"
						leaveFrom="transform opacity-100 scale-100"
						leaveTo="transform opacity-0 scale-95"
					>
						<Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none p-2 z-50">
							<div className="px-1 py-1 ">
								<Menu.Item
									className="border-b border-gray-200 w-full"
									onClick={() =>
										append({
											name: `${t('tools:tasks:new:verification-list')} #${fields.length + 1}`,
											subItems: [ { name: value, value: false, empty: false } ]
										})}
								>
									<button className="text-xs flex gap-2">
										<PlusIcon className="h-3 w-3" />
										{t('tools:tasks:new:create-new')}
									</button>
								</Menu.Item>
								<div className="mt-2">
									{fields.length > 0 &&
										fields.map((field, index) => (
											<Menu.Item
												key={index}
												className="flex gap-2 flex-col"
												onClick={() => onAddValue(index)}
											>
												<button className="text-xs mt-2">{field.name}</button>
											</Menu.Item>
										))}
								</div>
							</div>
						</Menu.Items>
					</Transition>
				)}
			</Menu>
		</div>
	);
}
