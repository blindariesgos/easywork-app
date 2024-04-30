'use client';
import Button from '../../../../../../../components/form/Button';
import { Popover, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next';

export default function ButtonDiscardedPolicy({selectedReason, setSelectedReason}) {
    const { t } = useTranslation();
    const discardPolicy = [ 
        {
            id: 1,
            name: t('leads:lead:stages:modal:negative:cancel'),
        }, 
        {
            id: 2,
            name: t('leads:lead:stages:modal:negative:canceled'),
        }, 
        {
            id: 3,
            name: t('leads:lead:stages:modal:negative:person'),
        }, 
        {
            id: 4,
            name: t('leads:lead:stages:modal:negative:documents'),
        },
        {
            id: 5,
            name: t('leads:lead:stages:modal:negative:noApproved'),
        },
        {
            id: 6,
            name: t('leads:lead:stages:modal:negative:noResources'),
        },
        {
            id: 7,
            name: t('leads:lead:stages:modal:negative:noInterested'),
        },
        {
            id: 8,
            name: t('leads:lead:stages:modal:negative:noReschedule'),
        },
        {
            id: 9,
            name: t('leads:lead:stages:modal:negative:noPresent'),
        },
        {
            id: 10,
            name: t('leads:lead:stages:modal:negative:noReschedule1'),
        },
        {
            id: 11,
            name: t('leads:lead:stages:modal:negative:noPresent1'),
        },
        {
            id: 12,
            name: t('leads:lead:stages:modal:negative:noAnswer'),
        },
        {
            id: 13,
            name: t('leads:lead:stages:modal:negative:otherReason'),
        },
        {
            id: 14,
            name: t('leads:lead:stages:modal:negative:otherDate'),
        },
        {
            id: 15,
            name: t('leads:lead:stages:modal:negative:policyIssued'),
        },
        {
            id: 16,
            name: t('leads:lead:stages:modal:negative:cost'),
        }
    ]


    return (
        <Popover className="relative">
            {({ open }) => (
            <>
                <Popover.Button
                    className={`
                        ${open ? 'text-white' : 'text-white/90'}
                        group inline-flex items-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
                >
                    <span>{t('leads:lead:stages:modal:discard')}</span>
                </Popover.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                >
                <Popover.Panel className="absolute left-48 z-10 mt-3 w-screen max-w-sm -translate-y-1/2 transform px-4 sm:px-0 ">
                    {({ close }) => (
                        <div className="overflow-hidden rounded-lg shadow-lg bg-gray-100 p-4">
                            <p className='textsm text-black font-medium'>{t('leads:lead:stages:modal:select')}</p>
                            <div className="relative grid gap-2 bg-white px-2 sm:px-4 grid-cols-1 mt-4 py-4">
                                {discardPolicy.length > 0 && discardPolicy.map((item) => (
                                    <div key={item.id} className='flex gap-x-2'>
                                        <div className="relative w-12">
                                           <input
                                                type="checkbox"
                                                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:text-primary bg-gray-100 focus:ring-primary"
                                                value={item.id}
                                                checked={selectedReason && selectedReason.some(reason => reason.id === item.id)}
                                                onChange={(e) =>{
                                                    setSelectedReason(
                                                        e.target.checked
                                                            ? [ ...selectedReason, item ]
                                                            : selectedReason.filter((p) => p.id !== item.id)
                                                    )}}
                                            />
                                        </div>
                                        <div>
                                            <p>{item.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center gap-4 sticky bottom-0 pt-4 pb-2">
                                <Button
                                    type="submit"
                                    label={t('common:buttons:save')}
                                    buttonStyle="primary"
                                    className="px-3 py-2"
                                />
                                <Button
                                    type="button"
                                    label={t('common:buttons:cancel')}
                                    buttonStyle="secondary"
                                    onclick={() => { setSelectedReason([]); close();}}
                                    className="px-3 py-2"
                                />
                            </div>
                        </div>
                    )}
                </Popover.Panel>
                </Transition>
            </>
            )}
        </Popover>
    )
}
