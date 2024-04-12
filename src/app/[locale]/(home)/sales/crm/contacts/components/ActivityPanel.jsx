import React from 'react';
import ActivityHeader from './ActivityHeader';
import CardTask from './CardTask';
import { UserIcon, VideoCameraIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

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
		iconBackground: 'bg-gray-400'
	},
	{
		id: 2,
		content: 'Advanced to phone screening by',
		child: CardTask,
		target: 'Bethany Blake',
		href: '#',
		date: 'Sep 22',
		datetime: '2020-09-22',
		icon: VideoCameraIcon,
		iconBackground: 'bg-blue-500'
	}
];

export default function ActivityPanel({ editing }) {
	return (
		<div className="px-4 relative bg-gray-100 rounded-tr-lg w-full md:w-3/5 ">
			{editing && <div className="inset-0 bg-white/75 w-full h-full z-10 absolute rounded-tr-lg" />}
			<div className="flow-root rounded-lg">
				<ul role="list" className="p-3">
					{timeline.slice(0, editing ? 1 : timeline.length).map((event, eventIdx) => (
						<li key={event.id} className="w-full">
							<div className="relative">
								{eventIdx !== timeline.length - 1 && !editing ? (
									<span
										className="absolute left-5 top-4 -ml-px h-full w-0.5 bg-zinc-400"
										aria-hidden="true"
									/>
								) : null}
								<div className="relative flex w-full">
									{!editing && (
										<div className="lg:w-[7%] w-[10%] mt-4">
											<span
												className={clsx(
													event.iconBackground,
													'h-10 w-10 rounded-full flex items-center justify-center'
												)}
											>
												<event.icon className="h-5 w-5 text-white" aria-hidden="true" />
											</span>
										</div>
									)}
									<div
										className={`bg-gray-200 lg:w-[93%] w-[90%] pb-4 px-4 ${eventIdx === 0
											? 'rounded-t-lg'
											: eventIdx === timeline.length - 1 && 'rounded-b-lg'}`}
									>
										{<event.child className="w-full" />}
									</div>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
