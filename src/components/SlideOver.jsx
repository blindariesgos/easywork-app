'use client';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import Tag from './Tag';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

export default function SlideOver({ openModal, setOpenModal, children, colorTag, labelTag, samePage, previousModalPadding }) {
	const { t } = useTranslation();
	const router = useRouter();
	const [ label, setLabel ] = useState('');
    const [modalWidth, setModalWidth] = useState(0);
	const searchParams = useSearchParams();
	const params = new URLSearchParams(searchParams);
	console.log("params", params.get("show"))
    const modalRef = useRef(null);

	useEffect(() => {
        function handleResize() {
            if (modalRef.current) {
                const width = modalRef.current.offsetWidth;
                setModalWidth(width);
            }
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [modalRef]);
  
	  console.log("previousModalPadding", previousModalPadding, modalWidth)
	useEffect(
		() => {
			switch (labelTag) {
				case 'contact':
					setLabel(t('contacts:header:contact'));
					break;
				case 'policy':
					setLabel(t('contacts:create:tabs:policies'));
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

				default:
					break;
			}
		},
		[ labelTag ]
	);

	return (
		<Transition.Root show={JSON.parse(params.get("show")) || openModal} as={Fragment}>
			<Dialog as="div" className="relative z-50" onClose={() => {}} >
				<div className="fixed inset-0" />
				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0' sm:pl-16">
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
								 	ref={modalRef}
									className={`pointer-events-auto w-screen ${previousModalPadding && 'pl-20'}`}   
								>
									<div className="flex">
										<Tag
											title={label}
											onclick={() => {
												setOpenModal
													? setOpenModal(false)
													: samePage ? router.replace(samePage) : router.back();
											}}
											className={colorTag}
										/>
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
