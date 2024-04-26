import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from './form/Button';
import { ChevronDownIcon, Cog8ToothIcon, TrashIcon } from '@heroicons/react/20/solid';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import IconDropdown from './SettingsButton';
import { FaMagnifyingGlass } from 'react-icons/fa6';

export default function ToolHeader({ title, children, route, Filters, toolButtons }) {
	const { t } = useTranslation();
	const searchParams = useSearchParams();
	const params = new URLSearchParams(searchParams);
	const pathname = usePathname();
	const { replace } = useRouter();

	const handlePathname = () => {
		params.delete('page');
		params.set('show', true);
		replace(`${route}/new?${params.toString()}`);
	};
	return (
		<header className="flex flex-col">
			<div className="lg:px-6 px-2 flex gap-3 items-center bg-white py-4 rounded-md flex-wrap">
				<h1 className="text-2xl font-semibold leading-6 text-gray-900 hidden md:block">{title}</h1>
				<Button
					label={t('contacts:header:create')}
					type="button"
					onclick={() => handlePathname()}
					buttonStyle={'primary'}
					icon={<ChevronDownIcon className="ml-2 h-5 w-5 text-white" />}
					className="px-3 py-2"
				/>
				<div className="flex-grow">
					<div className="flex border px-1 py-1 bg-gray-300 items-center rounded-md gap-x-2">
						<Filters />
						<div className="flex items-center w-full">
							<FaMagnifyingGlass className="h-4 w-4 text-primary" />
							<input
								type="search"
								name="search"
								id="search-cal"
								className="block w-full py-1.5 text-primary placeholder:text-primary sm:text-sm border-0 focus:ring-0 bg-gray-300"
								placeholder={t('contacts:header:search')}
							/>
						</div>
					</div>
				</div>
				{toolButtons}
			</div>
			{children}
		</header>
	);
}
