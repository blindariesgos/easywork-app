import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';

export const Pagination = ({ takeCount, total, pagActual, setPagActual }) => {
	const [ Pagination, setPagination ] = useState([]);
	const { t } = useTranslation();
	useEffect(
		() => {
			CreatePagination();
		},
		[ total, pagActual ]
	);

	const CreatePagination = () => {
		const pagination = [];
		const totalPages = Math.floor((Number(total) - 1) / Number(takeCount)) + 1;
		for (let i = 0; i < totalPages; i++) {
			i <= 4 && pagination.push(getPages(i));
		}
		if (totalPages > 4) pagination.push(<div>....</div>);
		if (totalPages > 5) pagination.push(getPages(totalPages - 1));
		setPagination(pagination);
	};

	const getPages = (i) => {
		return (
			<div
				key={i}
				className={clsx(
					'px-2 cursor-pointer font-medium text-xs flex items-center justify-center rounded-full w-6 h-6',
					pagActual === i ? ' bg-primary text-white ' : 'text-black bg-gray-200'
				)}
				onClick={() => setPagActual(i)}
			>
				{i + 1}
			</div>
		);
	};

	const totalPag = Math.floor((Number(total) - 1) / Number(takeCount)) + 1;

	return (
		<div>
			{totalPag >= 1 && (
				<div className="mt-2 items-center w-fit">
					<div className="flex flex-row justify-start p-2 border-none rounded-md gap-x-2 bg-white">
						<div
							className={clsx(
								'h-8 w-7 flex justify-center items-center rounded-md text-white',
								{
									'cursor-pointer font-bold bg-gray-200': pagActual === 0
								},
								{
									'cursor-default font-bold bg-easy-1100': pagActual > 0
								}
							)}
							onClick={() => {
								if (pagActual > 0) {
									setPagActual((prev) => prev - 1);
								}
							}}
						>
							<ChevronLeftIcon className="h-6 w-6" />
						</div>
						<div className="flex gap-x-2 items-center">{Pagination.map((pag, index) => (<div key={index}>{pag}</div>))}</div>
						<div
							className={clsx(
								'h-8 w-7 flex justify-center items-center rounded-md text-white',
								{
									'cursor-pointer font-bold bg-easy-1100': pagActual < totalPag - 1
								},
								{
									'cursor-default font-bold bg-gray-200': pagActual == totalPag - 1
								}
							)}
							onClick={() => {
								if (pagActual < totalPag - 1) {
									setPagActual((prev) => prev + 1);
								}
							}}
						>
							<ChevronRightIcon className="h-6 w-6" />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
