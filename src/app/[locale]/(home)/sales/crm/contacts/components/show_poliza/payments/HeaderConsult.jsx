'use client';
import Button from '@/components/form/Button';
import { PlusIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function HeaderConsult({ setAdd }) {
	const { t } = useTranslation();
	return (
		<div className="flex gap-4 rounded-md w-full p-2 bg-white flex-row sm:mt-8 mt-3 items-center lg:h-14">
			<div className="bg-blue-100 text-white shadow-md p-2 rounded-md">
				{t('contacts:edit:policies:payments:consult:name')}
			</div>
			<div>
				<Button
					label={t('contacts:edit:policies:add-policy')}
					buttonStyle="primary"
					className="px-3 py-2.5"
					icon={<PlusIcon className="w-5 h-5 text-white" />}
					onclick={() => setAdd(true)}
				/>
			</div>
		</div>
	);
}
