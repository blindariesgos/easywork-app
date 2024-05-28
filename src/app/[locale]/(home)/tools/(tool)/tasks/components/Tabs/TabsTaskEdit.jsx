'use client';
import { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import TabComment from './TabComment';
import TabTableHistory from './TabTableHistory';
import TabTableTime from './TabTableTime';
import TabTableObjections from './TabTableObjections';

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

export default function TabsTaskEdit({ data }) {
	const { t } = useTranslation();
	let [ categories, setCategories ] = useState(null);
	useEffect(() => {
		setCategories({
			comments: {
				name: t('tools:tasks:edit:comments'),
				qty: "21",
				pings: 9,
				component: TabComment,
				data: data
			},
			history: {
				name: t('tools:tasks:edit:history'),
				qty: "1",
				pings: 9,
				component: TabTableHistory,
				data: [
					{
						id: 1,
						date: "12/12/2023 15:08:40",
						created: "Nathaly Gomez",
						update: "Comentario creado",
						link: "#8965412",
						updating: "12/12/2023 15:00 - 19/12/2023 15:00"
					},
					{
						id: 2,
						date: "12/12/2023 0:00:00",
						created: "Nathaly Gomez",
						update: "Comentario creado",
						link: "#8965412",
						updating: "12/12/2023 15:00 - 19/12/2023 15:00"
					},
					{
						id: 3,
						date: "12/12/2023 15:08:40",
						created: "Nathaly Gomez",
						update: "Comentario creado",
						link: "#8965412",
						updating: "12/12/2023 15:00 - 19/12/2023 15:00"
					},
					{
						id: 4,
						date: "12/12/2023 15:08:40",
						created: "Nathaly Gomez",
						update: "Comentario creado",
						link: "#8965412",
						updating: "12/12/2023 15:00 - 19/12/2023 15:00"
					}
				]
			},
			time: {
				name: t('tools:tasks:edit:time'),
				qty: "00:00:00",
				pings: 9,
				component: TabTableTime,
				data: [
					{
						id: 1,
						date: "12/12/2023 15:08:40",
						created: "Yamile Rayme",
						time: "09:00:00",
						comment: "hola"
					},
					{
						id: 2,
						date: "5/29/2024 19:41:00",
						created: "Yamile Rayme",
						time: "09:00:00",
						comment: ""
					},
				]
			},
			objections: {
				name: t('tools:tasks:edit:objections'),
				qty: "1",
				pings: 9,
				component: TabTableObjections,
				data: [
					{
						id: 1,
						date: "12/12/2023 15:08:40",
						created: "Yamile Rayme",
					},
					{
						id: 2,
						date: "5/29/2024 19:41:00",
						created: "Yamile Rayme",
					},
				]
			}
		});
	}, [data, t])
	


	return (
		<div className="w-full">
			<Tab.Group>
				<Tab.List className="flex space-x-1 rounded-xl bg-transparent p-1 w-full">
					{categories && Object.keys(categories).map((category) => (
						<Tab
							key={category}
							className={({ selected }) =>
								classNames(
									'w-full rounded-lg py-1.5 text-xs font-medium leading-5 flex gap-2 justify-center items-center',
									'ring-0 focus:outline-none focus:ring-0',
									selected
										? `${category === "comments" ? "bg-white" : "bg-gray-100"} text-black shadow`
										: 'text-black hover:bg-white/[0.12] hover:text-white bg-gray-300'
								)}
						>
							{t(`tools:tasks:edit:${category}`)}
                            <div className='text-xs p-1 bg-gray-200 rounded-md'>
                                {categories[category].qty}
                            </div>
						</Tab>
					))}
				</Tab.List>
				<Tab.Panels className="mt-2 w-full">
					{categories && Object.values(categories).map((categ, idx) => (
						<Tab.Panel
							key={idx}
							className={classNames(
								`rounded-xl ${idx === 0 ? "bg-white" : "bg-gray-100"}`,
								'focus:outline-none focus:ring-0'
							)}
						>
							<categ.component data={categ.data} info={data}/>
						</Tab.Panel>
					))}
				</Tab.Panels>
			</Tab.Group>
		</div>
	);
}
