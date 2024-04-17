'use client';
import React from 'react';
import { ChevronDownIcon, Cog8ToothIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import Button from '@/components/form/Button';
import useAppContext from '@/context/app';
import { TrashIcon } from '@heroicons/react/24/outline';
import { FaMagnifyingGlass } from 'react-icons/fa6';
// import FiltersContact from './filters/FiltersContact';
import { useCommon } from '@/hooks/useCommon';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import IconDropdown from '@/components/SettingsButton';
import FiltersLead from './filters/FiltersLeads';

export default function LeadsHeader() {
	const { t } = useTranslation();
	const { setOpenModal } = useAppContext();
	const { trashLead, settingsLead } = useCommon();
	const searchParams = useSearchParams();
	const params = new URLSearchParams(searchParams);
	const pathname = usePathname();
	const { replace } = useRouter();

	const handlePathname = () => {
		params.delete( 'page');
		params.set('show', true); 
		replace(`/sales/crm/leads/lead?${params.toString()}`);
	}
	

	return (
		<header className="flex flex-col">
			<div className="lg:px-6 px-2 flex gap-3 items-center bg-white py-4 rounded-md flex-wrap">
				<h1 className="text-2xl font-semibold leading-6 text-gray-900 hidden md:block">
					{t('leads:header:lead')}
				</h1>
				<Button
					label={t('leads:header:create')}
					type="button"
					onclick={() => handlePathname()}
					buttonStyle={'primary'}
					icon={<ChevronDownIcon className="ml-2 h-5 w-5 text-white" />}
					className="px-3 py-2"
				/>
				<div className="flex-grow">
					<div className="flex border px-1 py-1 bg-gray-300 items-center rounded-md gap-x-2">
						<FiltersLead />
						<div className="flex items-center w-full">
							<FaMagnifyingGlass className="h-4 w-4 text-primary" />
							<input
								type="search"
								name="search"
								id="search-cal"
								className="block w-full py-1.5 text-primary placeholder:text-primary sm:text-sm border-0 focus:ring-0 bg-gray-300"
								placeholder={t('leads:header:search')}
							/>
						</div>
					</div>
				</div>

				<IconDropdown
					icon={<TrashIcon className="h-8 w-8 text-primary" aria-hidden="true" />}
					options={trashLead}
					width="w-72"
				/>
				<IconDropdown
					icon={<Cog8ToothIcon className="h-8 w-8 text-primary" aria-hidden="true" />}
					options={settingsLead}
					width="w-[340px]"
                    colorIcon="text-green-100"
                    excel={t('leads:header:excel:export')}
				/>
			</div>
		</header>
	);
}
