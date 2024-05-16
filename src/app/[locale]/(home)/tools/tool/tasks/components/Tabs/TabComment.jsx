'use client';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextEditor from '../TextEditor';
import { deleteComment, postComment, putComment } from '../../../../../../../../lib/apis';
import { getApiError } from '../../../../../../../../utils/getApiErrors';
import { useSession } from 'next-auth/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function TabComment({ data, info }) {
	// console.log('data', data, info);
	const { t } = useTranslation();
	const quillRef = useRef(null);
	const { data: session } = useSession();
	const [ value, setValueText ] = useState('');
	const [ disabled, setDisabled ] = useState(false);
	const [ openActions, setOpenActions ] = useState({});
	const [ editComment, setEditComment ] = useState({});

	const handleComment = async (e, id) => {
		if (e.key === 'Enter') {
			if (quillRef.current) {
				const quillEditor = quillRef.current.getEditor();
				const currentContents = quillEditor.getContents();
				const text = currentContents.ops.map((op) => op.insert).join('');
				const body = {
					comment: text,
					isSummary: info.requireSummary,			
					taskId: info.id
				};
				try {
					setDisabled(true);
					const response = id ? await putComment(id, body, info.id) : await postComment(body, info.id);
					setDisabled(false);
					setValueText('');
				} catch (error) {
					getApiError(error.message);
					setDisabled(false);
				}
			}
		}
	};

	const getDeleteComment = async (id) => {
		try {
			setDisabled(true);
			const response = await deleteComment(id, info.id);
			setDisabled(false);
		} catch (error) {
			getApiError(error.message);
			setDisabled(false);
		}
	};

	return (
		<div className="w-full p-3">
			<div className="cursor-pointer">
				<p className="text-xs">{t('tools:tasks:edit:pings', { qty: data.qty })}</p>
			</div>
			{data.comments.length > 0 && (
				<div className="gap-4 flex flex-col w-full">
					{data.comments.map((dat, index) => (
						<div
							className="flex gap-2 mt-4 items-center w-full"
							key={index}
							onMouseEnter={() => setOpenActions({ ...openActions, [index]: true })}
							onMouseLeave={() => setOpenActions({ ...openActions, [index]: false })}
						>
							{editComment[index] ? (
								<div className="flex gap-2 mt-4 items-center w-full">
									<Image
										className="h-7 w-7 rounded-full object-cover"
										width={36}
										height={36}
										src={'/img/avatar.svg'}
										alt=""
									/>
									<div className="border rounded-md w-full h-28">
										<TextEditor
											quillRef={quillRef}
											value={value}
											className="sm:h-16 h-30  w-full"
											setValue={setValueText}
											handleKeyDown={(e) => handleComment(e, dat.id)}
											disabled={disabled}
										/>
									</div>
								</div>
							) : (
								<div className="flex w-full gap-2">
									<Image
										className="h-7 w-7 rounded-full object-cover"
										width={36}
										height={36}
										src={'/img/avatar.svg'}
										alt=""
									/>
									<div className="bg-gray-200 rounded-md w-full p-2 text-xs">{dat.comment}</div>
									{openActions[index] && (
										<div className="flex justify-end items-center gap-1">
											<div
												onClick={() => {
													setEditComment({ [index]: !editComment[index] });
													setValueText(dat.comment);
												}}
												className="cursor-pointer hover:bg-gray-200 p-1 rounded-full"
											>
												<PencilIcon className="h-3 w-3 text-blue-400" />
											</div>
											<div
												onClick={() => getDeleteComment(dat.id)}
												className="cursor-pointer hover:bg-gray-200 p-1 rounded-full"
											>
												<TrashIcon className="h-3 w-3 text-red-500" />
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					))}
				</div>
			)}
			{Object.keys(editComment).length === 0 && (
				<div className="flex gap-2 mt-4 items-center w-full">
					<Image
						className="h-7 w-7 rounded-full object-cover"
						width={36}
						height={36}
						src={'/img/avatar.svg'}
						alt=""
					/>
					<div className="border rounded-md w-full h-28">
						<TextEditor
							quillRef={quillRef}
							value={value}
							className="sm:h-16 h-30  w-full"
							setValue={setValueText}
							handleKeyDown={handleComment}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
