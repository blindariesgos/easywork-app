'use client';
import React, { Fragment, useContext } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/navigation';
import Button from '../form/Button';
import { useAlertContext } from '../../context/common/AlertContext';

export const ModalAlert = ({ }) => {
    const { onCloseAlertDialog, isOpen, setIsOpen, stateAlert, disabled } = useAlertContext();
    const router = useRouter();

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => {onCloseAlertDialog()}}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black opacity-50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white py-6 px-8 text-left align-middle shadow-2xl transition-all">
                                <div className="flex flex-col gap-1 items-center justify-center mt-4">
                                    <p className="text-base text-black font-medium text-center">
                                        {stateAlert.title}
                                    </p>
                                </div>
                                {stateAlert.icon && (
                                    <div className="flex justify-center mt-4">
                                        <stateAlert.icon className='h-20 w-20 text-white' />
                                    </div>
                                )}
                                <div className="mt-6 flex justify-center gap-4">
                                    {stateAlert.buttonAccept && (
                                        <Button
                                            buttonStyle="primary"
                                            className="py-2 px-5"
                                            label={stateAlert.buttonAcceptLabel}
                                            onclick={stateAlert.onButtonAcceptClicked}
                                            disabled={disabled}
                                        />
                                    )}
                                    {stateAlert.buttonCancel && (
                                        <Button
                                            buttonStyle="outlined"
                                            className="py-2 px-5"
                                            label={stateAlert.buttonCancelLabel}
                                            onclick={stateAlert.onButtonCancelClicked}
                                            disabled={disabled}
                                        />
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}