import React from 'react';
import TableLeads from '../components/TableLeads';
import { getAllLeads } from '../../../../../../../lib/apis';


async function getLeads(page) {
	try {
		const tasks = await getAllLeads(page, 6);
		return tasks;
	} catch (error) {
		console.log("error", error)
	}
}

export default async function page({ params, searchParams: { page } }) {
	const leads = await getLeads(page);
	return (
		<div className="h-full relative">
			<TableLeads data={leads}/>
		</div>
	);
}
