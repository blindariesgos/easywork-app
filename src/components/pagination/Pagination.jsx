'use client'
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const Pagination = ({ totalPages, bgColor }) => {
	const [ Pagination, setPagination ] = useState([]);
	const searchParams = useSearchParams();
	const params = new URLSearchParams(searchParams);
	const pathname = usePathname();
	const { replace } = useRouter();
	const { t } = useTranslation();
	useEffect(
		() => {
			const params = new URLSearchParams(searchParams);
			const CreatePagination = () => {
				const pagination = [];
				const totalPagesPages = Number(totalPages);
				for (let i = 0; i < totalPagesPages; i++) {
					i <= 4 && pagination.push(getPages(i + 1));
				}
				if (totalPagesPages > 4) pagination.push(<div>....</div>);
				if (totalPagesPages > 5) pagination.push(getPages(totalPagesPages));
				setPagination(pagination);
			};
			
			const getPages = (i) => {
				return (
					<div
						key={i}
						className={clsx(
							'px-2 cursor-pointer font-medium text-xs flex items-center justify-center rounded-full w-6 h-6',
								Number(params.get('page')) === i ? ' bg-primary text-white ' : 'text-black bg-gray-200'
						)}
						onClick={() => {handlePathnamePage(i)}}
					>
						{i}
					</div>
				);
			};
			const handlePathnamePage = (page) => {
				params.set('page', page); 
				replace(`${pathname}?${params.toString()}`);
			}
		
			CreatePagination();
		},
		[ totalPages, pathname, replace, searchParams]
	);

	const handlePathname = (page) => {
		params.set('page', page); 
		replace(`${pathname}?${params.toString()}`);
	}


	const totalPagesPag = totalPages;

	return (
		<div>
			{totalPagesPag >= 1 && (
				<div className="items-center w-fit">
					<div className={`flex flex-row justify-start p-2 border-none rounded-md gap-x-2 ${bgColor || "bg-white"}`}>
						<div
							className={clsx(
								'h-8 w-7 flex justify-center items-center rounded-md text-white cursor-pointer',
								{
									'cursor-pointer font-bold bg-gray-200': Number(params.get('page')) === 1
								},
								{
									'cursor-default font-bold bg-easy-1100': Number(params.get('page')) > 1
								}
							)}
							onClick={() => {
								if (Number(params.get('page')) > 1) {
									handlePathname(Number(params.get('page')) - 1);
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
									'cursor-pointer font-bold bg-easy-1100': Number(params.get('page')) < totalPagesPag
								},
								{
									'cursor-default font-bold bg-gray-200': Number(params.get('page')) == totalPagesPag
								}
							)}
							onClick={() => {
								if (Number(params.get('page')) < totalPagesPag) {
									handlePathname(Number(params.get('page')) + 1);
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
