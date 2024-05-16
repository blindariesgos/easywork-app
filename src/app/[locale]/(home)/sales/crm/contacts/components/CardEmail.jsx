'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineMail } from "react-icons/hi";

export default function CardEmail({ data }) {
	const { t } = useTranslation();
	return (
		<div className="bg-white px-4 py-3 rounded-lg w-full">
			<div className="flex items-center">
				<div className="flex gap-2 items-center">
					<p className="text-xs text-primary font-medium">{data?.sent ? t('contacts:panel:enter') : t('contacts:panel:sent')}</p>
					<p className="text-xs text-primary font-medium">{t('contacts:panel:date')}: 02/02/2024 13:33 pm</p>
				</div>
			</div>
			<div className="flex gap-4 md:gap-8 mt-3">
				<div className="flex flex-col gap-2">
					<div className="p-4 bg-gray-100 rounded-lg">
						<HiOutlineMail className="h-12 w-12 text-black" />
					</div>
					<div className="px-4 py-2 bg-gray-100 rounded-lg flex justify-center items-center">
						<p className="text-xs text-primary font-medium">{t('contacts:panel:open')}</p>
					</div>
				</div>
				<div className="flex flex-col gap-2 w-full">
					<div className="flex gap-x-4 items-center">
						<p className="text-sm text-black font-medium">{t('contacts:panel:subject')}:</p>
						<p className="text-xs text-black font-normal">Respuesta cotización</p>
					</div>
					<div className="flex gap-x-4 items-center">
						<p className="text-sm text-black font-medium">{t('contacts:panel:addressee')}:</p>
						<p className="text-xs text-black font-normal">Roberto Perez</p>
					</div>
					<div className="flex gap-x-4 items-center">
						<p className="text-sm text-black font-medium">{t('contacts:panel:sender')}:</p>
						<p className="text-xs text-black font-normal">Juanito Cruz</p>
					</div>
				</div>
			</div>
		</div>
	);
}
