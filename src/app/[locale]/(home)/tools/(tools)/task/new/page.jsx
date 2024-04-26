import SlideOver from '@/components/SlideOver';
import React from 'react';
import TaskCreate from './TaskCreate';

export default function page() {
	return (
		<SlideOver colorTag="bg-yellow-100" samePage={`/tools/task?page=1`}>
			<TaskCreate />
		</SlideOver>
	);
}
