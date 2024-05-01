'use client';
import Header from '../../../../../components/header/Header';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ToolsLayout({ children, table, modal }) {
	const { t } = useTranslation();
	return (
		<div className="bg-gray-100 p-4 rounded-xl h-auto">
			<Header />
			<div className='h-[90%]'>{children}</div>
		</div>
	);
}
