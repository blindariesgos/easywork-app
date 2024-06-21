'use client';
import React, { useEffect, useState } from 'react';
import ActivityHeader from './ActivityHeader';
import { CameraIcon, ChatBubbleLeftRightIcon, CheckIcon, UserIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import CardVideo from './CardVideo';
import CardTask from './CardTask';
import { ChatBubbleBottomCenterIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import FilterPanel from './FilterPanel';
import CardWhatsapp from './CardWhatsapp';
import CardEmail from './CardEmail';
import CardComment from './CardComment';
import { useContactActivities } from '@/src/lib/api/hooks/contacts';

const timeline = [
	{
		id: 1,
		child: ActivityHeader,
		content: 'Applied to',
		target: 'Front End Developer',
		href: '#',
		date: 'Sep 20',
		datetime: '2020-09-20',
		icon: UserIcon,
		iconBackground: 'bg-gray-200'
	},
	{
		id: 2,
		content: 'Advanced to phone screening by',
		child: CardTask,
		target: 'Bethany Blake',
		href: '#',
		date: 'Sep 22',
		datetime: '2020-09-22',
		icon: EnvelopeIcon,
		iconBackground: 'bg-primary',
		toDo: true
	},
	{
		id: 3,
		content: 'Advanced to phone screening by',
		child: CardVideo,
		target: 'Bethany Blake',
		href: '#',
		date: 'Sep 22',
		datetime: '2020-09-22',
		icon: CameraIcon,
		iconBackground: 'bg-blue-100',
		more: true
	},
	{
		id: 4,
		content: 'Advanced to phone screening by',
		child: CardWhatsapp,
		target: 'Bethany Blake',
		href: '#',
		date: 'Sep 22',
		datetime: '2020-09-22',
		icon: ChatBubbleLeftRightIcon,
		iconBackground: 'bg-green-100',
		more: true
	},
	{
		id: 5,
		content: 'Advanced to phone screening by',
		child: CardEmail,
		target: 'Bethany Blake',
		href: '#',
		date: 'Sep 22',
		datetime: '2020-09-22',
		icon: EnvelopeIcon,
		iconBackground: 'bg-primary',
	},
	{
		id: 6,
		content: 'Advanced to phone screening by',
		child: CardComment,
		target: 'Bethany Blake',
		href: '#',
		date: 'Sep 22',
		datetime: '2020-09-22',
		icon: ChatBubbleBottomCenterIcon,
		iconBackground: 'bg-gray-200'
	},
	{
		id: 7,
		content: 'Advanced to phone screening by',
		child: CardEmail,
		target: 'Bethany Blake',
		href: '#',
		date: 'Sep 22',
		datetime: '2020-09-22',
		icon: EnvelopeIcon,
		iconBackground: 'bg-primary',
		sent: true
	},
];

function parseAndSortByDate(data) {
	// Combine tasks and comments with their type
	const combined = [
		...data.tasks.map(task => ({ type: 'task', ...task })),
	];

	// Sort combined array by createdAt date
	combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

	return combined;
}

export default function ActivityPanel({ contactId }) {
	const [bulkActivity, setBulkActivity] = useState([]);
	const { activities, isError, isLoading } = useContactActivities(contactId);



	useEffect(() => {
		if (activities) {
			const sortedItems = parseAndSortByDate(activities);

			setBulkActivity(sortedItems);
		}
	}, [activities]);

	const { t } = useTranslation();
	console.log("Activities", bulkActivity);

	if (isError) {
		return <div>Error</div>
	}

	if (isLoading) {
		return <div>Loading</div>
	}

	return (
		<div className="px-4 relative bg-gray-100 rounded-tr-lg w-full md:w-3/5 h-full overflow-y-auto">
			<div className="w-full flex ">
				<div className="flow-root rounded-lg w-full">
					<ul role="list" className="p-3">
						<li className="w-full">
							<div className="relative">
								<span
									className="absolute left-5 top-4 -ml-px h-full w-0.5 bg-zinc-400"
									aria-hidden="true"
								/>
								<div className="relative flex w-full">
									<div className="lg:w-[7%] w-[10%] mt-4">
										<span
											className={clsx(
												'bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center'
											)}
										>
											<UserIcon className="h-5 w-5 text-white" aria-hidden="true" />
										</span>
									</div>

									<div
										className={`bg-gray-200 lg:w-[93%] w-[90%] ml-4 pb-4 px-4 rounded-t-lg`}
									>

										<ActivityHeader className="w-full" />
									</div>
								</div>
							</div>
						</li>
						{
							bulkActivity.map((activity, activityIdx) => (
								<li key={activity.id} className="w-full">
									<div className="relative">
										{activityIdx !== bulkActivity.length - 1 && (
											<span
												className="absolute left-5 top-4 -ml-px h-full w-0.5 bg-zinc-400"
												aria-hidden="true"
											/>)}
										<div className="relative flex w-full">
											<div className="lg:w-[7%] w-[10%] mt-4">
												<span
													className={clsx(
														'h-10 w-10 rounded-full flex items-center justify-center bg-primary'
													)}
												>
													{activity.type === 'task' && <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />}
												</span>
											</div>
											<div
												className={`bg-gray-200 lg:w-[93%] w-[90%] ml-4 pb-4 px-4 ${activityIdx === timeline.length - 1 && 'rounded-b-lg'}`}
											>
												<ActivityCard activity={activity} />
											</div>
										</div>
									</div>
								</li>
							))
						}
					</ul>
				</div>
			</div>
		</div>
	);
}

function ActivityCard({ activity }) {

	switch (activity.type) {
		case "task":
			return <CardTask data={activity} />

		default:
			<>Ok</>
			break;
	}
}
