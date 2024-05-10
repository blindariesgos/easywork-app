'use client';
import React from 'react';
import ActivityHeader from './ActivityHeader';
import { CameraIcon, ChatBubbleLeftRightIcon, UserIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import CardVideo from './CardVideo';
import CardTask from './CardTask';
import { ChatBubbleBottomCenterIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import FilterPanel from './FilterPanel';
import CardWhatsapp from './CardWhatsapp';
import CardEmail from './CardEmail';
import CardComment from './CardComment';

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

export default function ActivityPanel({ editing }) {
	const { t } = useTranslation();
	return (
		<div className="px-4 relative bg-gray-100 rounded-tr-lg w-full md:w-3/5 h-full overflow-y-auto">
			<div className="w-full flex ">
				{editing && (
					<div className="inset-0 bg-white/75 w-full z-10 absolute rounded-tr-lg h-full md:h-[62vh]" />
				)}
				<div className="flow-root rounded-lg w-full">
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
											className={`bg-gray-200 lg:w-[93%] w-[90%] ml-4 pb-4 px-4 ${eventIdx === 0
												? 'rounded-t-lg'
												: eventIdx === timeline.length - 1 && 'rounded-b-lg'}`}
										>
											{event.toDo && (
												<div className="flex gap-2 w-full items-center mb-2">
													<div className="border-b border-yellow-100 w-full" />
													<div className="text-[10px] py-1 px-2 bg-yellow-100  text-black rounded-xl w-56 flex ">
														{t('tools:tasks:panel:todo')}
													</div>
													<div className="border-b border-yellow-100 w-full" />
												</div>
											)}
											{event.more && (
												<div className="flex gap-2 w-full items-center mb-2">
													<div className="border-b border-primary w-full" />
													<div className="text-[10px] py-1 px-2 bg-primary text-white rounded-xl">
														20/10/10
													</div>
													<div className="border-b border-primary w-full" />
													<div><FilterPanel/></div>
												</div>
											)}
											{<event.child className="w-full" data={event} />}
										</div>
									</div>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
