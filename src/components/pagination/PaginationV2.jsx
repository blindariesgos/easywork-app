'use client'
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const PaginationV2 = ({ totalPages, bgColor, currentPage, setPage }) => {
	const [pages, setPages] = useState([]);

	useEffect(() => {
		const handlePathnamePage = (page) => {
			setPage(page);
		}
		const getPages = (i) => {
			return (
				<div
					key={i}
					className={clsx(
						'px-2 cursor-pointer font-medium text-xs flex items-center justify-center rounded-full w-6 h-6',
						Number(currentPage) === i ? ' bg-primary text-white ' : 'text-black bg-gray-200'
					)}
					onClick={() => { handlePathnamePage(i) }}
				>
					{i}
				</div>
			);
		};
		const buildPagination = () => {
			const pagination = [];
			const totalPagesPages = Number(totalPages);
			for (let i = 0; i < totalPagesPages; i++) {
				i <= 4 && pagination.push(getPages(i + 1));
			}
			if (totalPagesPages > 4) pagination.push(<div>....</div>);
			if (totalPagesPages > 5) pagination.push(getPages(totalPagesPages));
			setPages(pagination);
		};

		buildPagination();
	}, [
		totalPages
	]);

	const handlePathname = (page) => {
		setPage(page)
	}


	const totalPagesPag = totalPages;

	return (
		<div>
			{totalPagesPag >= 1 && (
				<div className="items-center w-fit">
					<div className={`flex flex-row justify-start p-2 border-none rounded-md gap-x-2 ${bgColor || "bg-white"}`}>
						<div
							className={clsx('h-8 w-7 flex justify-center items-center rounded-md text-white cursor-pointer',
								{
									'cursor-pointer font-bold bg-gray-200': Number(currentPage) === 1,
									'cursor-default font-bold bg-easy-1100': Number(currentPage) > 1
								}
							)}
							onClick={() => {
								if (Number(currentPage) > 1) {
									handlePathname(Number(currentPage) - 1);
								}
							}}
						>
							<ChevronLeftIcon className="h-6 w-6" />
						</div>
						<div className="flex gap-x-2 items-center">{pages.map((pag, index) => (<div key={index}>{pag}</div>))}</div>
						<div
							className={clsx(
								'h-8 w-7 flex justify-center items-center rounded-md text-white',
								{
									'cursor-pointer font-bold bg-easy-1100': Number(currentPage) < totalPagesPag
								},
								{
									'cursor-default font-bold bg-gray-200': Number(currentPage) == totalPagesPag
								}
							)}
							onClick={() => {
								if (Number(currentPage) < totalPagesPag) {
									handlePathname(Number(currentPage) + 1);
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
