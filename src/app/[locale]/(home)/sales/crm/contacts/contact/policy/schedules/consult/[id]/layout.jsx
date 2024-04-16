import NotFound from '@/app/[locale]/not-found';
import React from 'react';
import ScheduleDetail from './ScheduleDetail';

export default async function ScheduleLayout({ params: { id }, children }) {
	if (!id) return <NotFound />;

	if (id)
		return (
			<div>
				<ScheduleDetail id={id} />
			</div>
		);
}
