import React from 'react';
import TableTask from './TableTask';
import { getTasks } from '@/lib/apis';

async function getAllTasks(page) {
	try {
		const tasks = await getTasks(page, 6);
		return tasks;
	} catch (error) {
		console.log("error", error)
	}
}
// async function useContact({ contactID }) {
// 	const response = await getContact(contactID);
// 	return response;
// }

const wait3seconds = () => {
	return new Promise((resolve) => setTimeout(resolve, 5000));
};
export default async function page({ params, searchParams: { page } }) {
	const tasks = await getAllTasks(page);
	console.log("tasksData", tasks)
	return (
		<div className="relative h-full">
			<TableTask  data={tasks} />
		</div>
	);
}
