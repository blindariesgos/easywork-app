'use client';
import Header from '@/components/header/Header';
import { Suspense, useEffect } from 'react';
import HeaderCrm from '../HeaderCrm';
import { useTranslation } from 'react-i18next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import LeadsHeader from './components/LeadsHeader';
import LoaderSpinner from '@/components/LoaderSpinner';
import { useLeads } from '@/hooks/useCommon';

export default function LayoutLeads({ table,  children}) {
	const { t } = useTranslation();
	const searchParams = useSearchParams();
	const params = new URLSearchParams(searchParams);
	const pathname = usePathname();
	const { replace } = useRouter();
	const { optionsHeader } = useLeads();

	useEffect(() => {
		if (Number(params.get('page')) === 0 || !params.get('page')) {
			params.set('page', 1);
			replace(`${pathname}?${params.toString()}`);
		}
	}, []);

	return (
		<div className="bg-gray-100 h-full p-2 rounded-xl relative">
			<Header />
			<div className="flex flex-col w-full">
				<HeaderCrm options={optionsHeader} />
				<LeadsHeader />
				<Suspense fallback={<LoaderSpinner />}>{table}</Suspense>
				{children}
			</div>
		</div>
	);
}
