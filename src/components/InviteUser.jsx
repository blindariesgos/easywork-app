'use client';

import { Fragment, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Dialog, DialogPanel, Transition, TransitionChild, Select } from '@headlessui/react';
import { PaperClipIcon, EnvelopeIcon } from '@heroicons/react/20/solid';
import { VscLink } from 'react-icons/vsc';

// Components
import { EnableFastRegistration } from './user-invitations/EnableFastRegistration';
import { LinkInvitation } from './user-invitations/LinkInvitation';
import { EmailInvitation } from './user-invitations/EmailInvitation';
import { MassiveInvitation } from './user-invitations/MassiveInvitation';
import { FromAnotherCompanyInvitation } from './user-invitations/FromAnotherCompanyInvitation';
import { InvitationMethodTitle } from './user-invitations/InvitationMethodTitle';
import { InvitationFooter } from './user-invitations/InvitationFooter';
import Tag from './Tag';

const InvitationMethods = {
  1: {
    title: 'Enlace',
    icon: <VscLink className="w-5 h-5 text-white" />,
    headerAction: null,
    component: <LinkInvitation />,
  },
  2: {
    title: 'Correo electrónico',
    icon: <EnvelopeIcon className="w-5 h-5 text-white" />,
    headerAction: null,
    component: <EmailInvitation />,
  },
  3: {
    title: 'Invitación masiva',
    icon: <PaperClipIcon className="w-5 h-5 text-white" />,
    headerAction: null,
    component: <MassiveInvitation />,
  },
  4: {
    title: 'Un usuario de otra compañía',
    icon: <EnvelopeIcon className="w-5 h-5 text-white" />,
    headerAction: null,
    component: <FromAnotherCompanyInvitation />,
  },
};

export default function InviteUser({ previousModalPadding, colorTag }) {
  // Hooks
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  // States
  const [invitationOption, setInvitationOption] = useState('');

  // Definitions
  const isInviteUserDialogOpen = JSON.parse(params.get('inviteuser'));

  const SelectedMethod = InvitationMethods[invitationOption];

  const closeDrawer = () => {
    router.back();
  };

  return (
    <Transition show={isInviteUserDialogOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 bg-red-400" onClose={closeDrawer}>
        <div className="bg-gray-900 bg-opacity-60 fixed inset-0 z-40 overflow-y-auto">
          <TransitionChild
            as={Fragment}
            enter="transform transition ease-in-out duration-500 sm:duration-700"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-500 sm:duration-700"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className={`pointer-events-auto w-screen drop-shadow-lg ${previousModalPadding}`}>
              <div className="flex justify-end h-screen max-w-full pl-0 2xl:pl-52">
                <div className={`flex flex-col`}>
                  <Tag onclick={closeDrawer} className={colorTag} />
                </div>

                <div className="h-screen rounded-tl-lg rounded-bl-lg bg-gray-300 p-6 xs:w-full sm:w-full md:w-1/2 lg:w-[700px]">
                  <h1 className="text-xl">Invitar usuario</h1>

                  <Select
                    className="bg-easywork-main hover:bg-easywork-mainhover text-white rounded-md w-full text-sm mt-5 mb-2"
                    onChange={e => setInvitationOption(e.target.value)}
                    value={invitationOption}
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="1">Enlace</option>
                    <option value="2">Correo electrónico</option>
                    <option value="3">Invitación masiva</option>
                    <option value="4">Usuario de otra compañía</option>
                  </Select>

                  <div className="bg-white rounded-lg p-5">
                    {!SelectedMethod && <p>Debe seleccionar un método</p>}

                    {SelectedMethod && (
                      <>
                        <InvitationMethodTitle title={SelectedMethod.title} icon={SelectedMethod.icon} rightAction={SelectedMethod.headerAction} />

                        <div className="mt-5">{SelectedMethod.component}</div>
                      </>
                    )}
                  </div>

                  {invitationOption && <InvitationFooter />}
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
