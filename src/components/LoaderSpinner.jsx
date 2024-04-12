'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LoaderSpinner() {
	const { t } = useTranslation();
	return (
		<div className="absolute z-50 inset-0 bg-easy-800/10 w-full h-full">
			{/* Loader spinner */}

			<div className="flex items-center justify-center h-full flex-col gap-2 cursor-progress">
				<div className="animate-spin rounded-full h-28 w-28 border-t-2 border-b-2 border-easy-600" />
				<p className="text-easy-600 animate-pulse select-none">{t('contacts:create:save')}</p>
			</div>
		</div>
	);
}
