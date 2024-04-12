'use client';
import React from 'react';
import IconDropdown from '../SettingsButton';
import { Cog8ToothIcon } from '@heroicons/react/20/solid';
import { useCommon } from '@/hooks/useCommon';
import { useTranslation } from 'react-i18next';

export default function HeaderDataPoliza() {
    const { t } = useTranslation();
    const { settingsPolicy } = useCommon();
	return (
		<div className="flex sm:justify-between sm:flex-row flex-col items-center justify-start">
			<div className='flex flex-col sm:gap-5 gap-2 flex-wrap'>
                <div className='flex gap-x-4 items-center flex-wrap'>
                    <h1 className='text-2xl font-medium'>{"name"}</h1>
                    <div className='text-sm uppercase font-medium'>{t('contacts:edit:policies:consult:date')}: 10/06/24</div>
                    <div className='text-sm uppercase font-medium'>{t('contacts:edit:policies:consult:product')}: Profesional</div>
                </div>
                <div className='flex gap-x-4 items-center flex-wrap'>
                    <div className='text-sm uppercase font-medium'>{t('contacts:edit:policies:consult:policy')}: 62231</div>
                    <div className='text-sm uppercase font-medium'>{t('contacts:edit:policies:consult:company')}: AXXA</div>
                    <div className='text-sm uppercase font-medium'>{t('contacts:edit:policies:consult:code')}: 325841</div>
                </div>
            </div>
			<div>
				<IconDropdown
					icon={<Cog8ToothIcon className="h-8 w-8 text-primary" aria-hidden="true" />}
					options={settingsPolicy}
					width="w-[340px]"
					colorIcon="text-green-100"
				/>
			</div>
		</div>
	);
}
