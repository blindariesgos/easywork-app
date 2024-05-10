'use client';
import { ChatBubbleBottomCenterIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineMail } from 'react-icons/hi';

export default function CardComment() {
	const { t } = useTranslation();
	return (
		<div className="bg-white px-4 py-3 rounded-lg w-full">
			<div className="flex items-center">
				<div className="flex gap-2 items-center">
					<p className="text-xs text-primary font-medium">
						{t('contacts:panel:comment')}
					</p>
					<p className="text-xs text-primary font-medium">{t('contacts:panel:date')}: 02/02/2024 13:33 pm</p>
				</div>
			</div>
			<div className="flex gap-4 md:gap-8 mt-3">
				<div className="">
					<div className="p-4 bg-primary rounded-full">
						<ChatBubbleBottomCenterIcon className="h-10 w-10 text-white" />
					</div>
				</div>
				<div className="flex flex-col gap-2 w-full">
					<p className="text-lg text-black font-medium">{t('contacts:panel:comment')}</p>
					<div className="flex gap-x-4 items-center">
						<p className="text-sm text-black font-normal">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Expedita itaque earum saepe est. Natus autem odio quo dignissimos nostrum ipsam dolores pariatur a eaque officia modi, eveniet obcaecati odit voluptate?</p>
					</div>
				</div>
			</div>
		</div>
	);
}
