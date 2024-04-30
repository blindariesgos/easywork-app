import SlideOver from '../../../../../../../../components/SlideOver';
import React from 'react';
import TaskEdit from './TaskEdit';

export default async function page() {
	return (
		<SlideOver colorTag="bg-green-primary" samePage={`/tools/tasks?page=1`}>
			<TaskEdit/>
		</SlideOver>
	);
}
