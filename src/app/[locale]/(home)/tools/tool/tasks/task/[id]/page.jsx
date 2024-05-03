import SlideOver from '../../../../../../../../components/SlideOver';
import React from 'react';
import TaskEdit from './TaskEdit';
import { getTaskId } from '@/lib/apis';

async function getTasksId(id) {
	try {
		const tasks = await getTaskId(id);
		return tasks;
	} catch (error) {
		console.log("error", error)
	}
}
export default async function page({ params : { id }}) {
	const data = await getTasksId(id);
	return (
		<SlideOver colorTag="bg-green-primary" samePage={`/tools/tool/tasks?page=1`}>
			<TaskEdit data={data}/>
		</SlideOver>
	);
}
