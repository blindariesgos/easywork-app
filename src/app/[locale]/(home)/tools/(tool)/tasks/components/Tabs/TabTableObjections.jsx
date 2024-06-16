'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function TabTableObjections() {
	const objections = [];
	const { t } = useTranslation();
	return (
		<div className="relative overflow-hidden sm:rounded-lg p-2">
			<table className="min-w-full rounded-md bg-gray-100 table-auto">
				<thead className="text-xs bg-white drop-shadow-sm">
					<tr className="">
						<th
							scope="col"
							className={`py-3.5 text-xs font-normal text-black cursor-pointer rounded-s-xl`}
						>
							{t('tools:tasks:edit:table:date')}
						</th>
						<th
							scope="col"
							className={`py-3.5 text-xs font-normal text-black cursor-pointer`}
						>
							{t('tools:tasks:edit:table:created-by')}
						</th>
					</tr>
				</thead>
				<tbody className="bg-gray-100">
					{objections.length > 0 &&
						objections.map((obj, index) => (
							<tr key={index}>
								<td className="text-xs py-2 text-center">{obj.date}</td>
								<td className="text-xs py-2 text-center">{obj.created}</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}
