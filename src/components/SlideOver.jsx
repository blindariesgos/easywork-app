'use client';
import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import Tag from './Tag';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SlideOver({
	openModal,
	setOpenModal,
	children,
	colorTag,
	labelTag,
	samePage,
	previousModalPadding,
	subLabelTag,
}) {
	const { t } = useTranslation();
	const router = useRouter();
	const [ label, setLabel ] = useState('');
	const [ subLabel, setSubLabel] = useState('');
	const searchParams = useSearchParams();
	const params = new URLSearchParams(searchParams);

	useEffect(
		() => {
			switch (labelTag) {
				case 'contact':
					setLabel(t('contacts:header:contact'));
					break;
				case 'policy':
					setLabel(t('contacts:create:tabs:policies'));
					break;
				case 'consult':
					setLabel(t('contacts:edit:policies:table:policy'));
					break;
				case 'life':
					setLabel(t('contacts:policies:branches:life'));
					break;
				case 'cars':
					setLabel(t('contacts:policies:branches:cars'));
					break;
				case 'medicine':
					setLabel(t('contacts:policies:branches:medicinal'));
					break;
				case 'damages':
					setLabel(t('contacts:policies:branches:damages'));
					break;
				case 'various':
					setLabel(t('contacts:policies:branches:various'));
					break;
				case 'payments':
					setLabel(t('contacts:edit:policies:consult:payments'));
					break;
				case 'claims':
					setLabel(t('contacts:edit:policies:consult:claims'));
					break;
				case 'refunds':
					setLabel(t('contacts:edit:policies:consult:refund'));
					break;
				case 'invoices':
					setLabel(t('contacts:edit:policies:consult:invoices'));
					break;
				case 'versions':
					setLabel(t('contacts:edit:policies:consult:versions'));
					break;
				case 'commissions':
					setLabel(t('contacts:edit:policies:consult:commissions'));
					break;
				case 'quotes':
					setLabel(t('contacts:edit:policies:consult:quotes'));
					break;
				case 'schedules':
					setLabel(t('contacts:edit:policies:consult:schedules'));
					break;
			

				default:
					break;
			}
		},
		[ labelTag ]
	);

	useEffect(
		() => {
			switch (subLabelTag) {
				case 'consult':
					setSubLabel(t('contacts:edit:policies:consult:name'));

				default:
					break;
			}
		},
		[ subLabelTag ]
	);
	// if (!params.get("show")) return <div/>;

	// useEffect(() => {
	// 	if ( !params.get('show') ){
	// 		params.set('show', true);
	// 		replace(`${pathname}?${params.toString()}`);
	// 	}
	// }, [])
	if (params.get('show'))
		return (
			<Transition.Root show={JSON.parse(params.get('show'))} as={Fragment}>
				<Dialog as="div" className="relative z-50" onClose={() => {}}>
					<div className="fixed inset-0" />
					<div className="fixed inset-0 overflow-hidden">
						<div className="absolute inset-0 overflow-hidden">
							<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 2xl:pl-52">
								<Transition.Child
									as={Fragment}
									enter="transform transition ease-in-out duration-500 sm:duration-700"
									enterFrom="translate-x-full"
									enterTo="translate-x-0"
									leave="transform transition ease-in-out duration-500 sm:duration-700"
									leaveFrom="translate-x-0"
									leaveTo="translate-x-full"
								>
									<Dialog.Panel
										className={`pointer-events-auto w-screen drop-shadow-lg ${previousModalPadding}`}
									>
										<div className="flex">
											<div className={`flex flex-col`}>
												<Tag
													title={label}
													onclick={() => {
														setOpenModal
															? setOpenModal(false)
															: samePage ? router.replace(samePage) : router.back();
													}}
													className={colorTag}
												/>
												{subLabelTag && (
													<Tag title={subLabel} className="bg-green-primary pl-2" closeIcon second/>
												)}
											</div>
											{children}
										</div>
									</Dialog.Panel>
								</Transition.Child>
							</div>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		);
}
