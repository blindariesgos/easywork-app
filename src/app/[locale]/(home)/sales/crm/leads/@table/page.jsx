import React from 'react';
import TableLeads from '../components/TableLeads';

const wait3seconds = () => {
	return new Promise((resolve) => setTimeout(resolve, 5000));
};
export default async function Page() {
	await wait3seconds();
	return (
		<div className="h-full relative">
			<TableLeads />
		</div>
	);
}
