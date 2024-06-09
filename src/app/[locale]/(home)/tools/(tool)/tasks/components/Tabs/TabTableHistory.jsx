'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function TabTableHistory() {
	const history = [];
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
						<th
							scope="col"
							className={`py-3.5 text-xs font-normal text-black cursor-pointer`}
						>
							{t('tools:tasks:edit:table:update')}
						</th>
						<th
							scope="col"
							className={`py-3.5 text-xs font-normal text-black cursor-pointer rounded-e-xl`}
						>
							{t('tools:tasks:edit:table:updating')}
						</th>
					</tr>
				</thead>
				<tbody className="bg-gray-100">
					{history.length > 0 &&
						history.map((hist, index) => (
							<tr key={index}>
								<td className="text-xs py-2 text-center">{hist.date}</td>
								<td className="text-xs py-2 text-center">{hist.created}</td>
								<td className="text-xs py-2 text-center flex justify-center">
									<div className='text-xs flex gap-1'>
										{hist.update}
										<div className='text-primary border-b border-primary'>{hist.link}</div>
									</div>
								</td>
								<td className="text-xs py-2 text-center">{hist.updating}</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}
