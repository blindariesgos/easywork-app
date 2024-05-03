'use client';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextEditor from '../TextEditor';
import DropdownVisibleUsers from '../DropdownVisibleUsers';

export default function TabComment({ data }) {
	const { t } = useTranslation();
	const quillRef = useRef(null);
	const [ value, setValueText ] = useState('');

	return (
		<div className="w-full p-3">
			<div className="cursor-pointer">
				<p className="text-xs">{t('tools:tasks:edit:pings', { qty: data.qty })}</p>
			</div>
			<div className="flex gap-2 mt-4 items-center w-full">
				<Image
					className="h-9 w-9 rounded-full object-cover"
					width={36}
					height={36}
					src="https://images.unsplash.com/photo-1542309667-2a115d1f54c6?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					alt=""
				/>
				<div className='border rounded-md w-full h-28'>
					<TextEditor
						quillRef={quillRef}
						value={value}
						className="sm:h-16 h-30  w-full"
                        setValue={setValueText}
					/>
				</div>
			</div>
		</div>
	);
}
