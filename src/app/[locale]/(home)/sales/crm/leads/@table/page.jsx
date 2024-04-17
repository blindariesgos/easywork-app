import React from 'react';
import TableLeads from '../components/TableLeads';
import { Pagination } from '@/components/pagination/Pagination';
const wait3seconds = () => {
	return new Promise((resolve) => setTimeout(resolve, 5000));
};
export default async function Page() {
	await wait3seconds();
	return (
		<div className="h-full relative">
			<TableLeads />
			<div className="absolute bottom-0">
				<Pagination totalPages={10} />
			</div>
		</div>
	);
}
