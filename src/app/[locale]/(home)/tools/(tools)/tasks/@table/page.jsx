import React from 'react';
import TableTask from './TableTask';
import { Pagination } from '@/components/pagination/Pagination';

export default async function page() {
	return (
		<div className="relative h-full">
			<TableTask />
		</div>
	);
}
