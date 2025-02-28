'use client';
import { Fragment, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogPanel, Transition, TransitionChild, Switch, Select } from '@headlessui/react';
import { PaperClipIcon, EnvelopeIcon } from '@heroicons/react/20/solid';
import { VscLink } from 'react-icons/vsc';
import * as yup from 'yup';

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
    headerAction: <EnableFastRegistration />,
    component: <LinkInvitation />,
  },
  2: {
    title: 'Mediante correo electrónico o número de teléfono',
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
  const [invite, setInvite] = useState(1);
  const { t } = useTranslation();
  const session = useSession();
  const [enabled, setEnabled] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const schema = yup.object().shape({
    responsible: yup.string(),
  });

  useEffect(() => {}, [params.get('inviteuser')]);

  const SelectedMethod = InvitationMethods[invite];

  return (
    <Transition show={params.get('inviteuser')} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 2xl:pl-52">
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
                  <div className="flex justify-end h-screen">
                    <div className={`flex flex-col`}>
                      <Tag
                        onclick={() => {
                          router.back();
                        }}
                        className={colorTag}
                      />
                    </div>

                    <div className="h-screen rounded-tl-lg rounded-bl-lg bg-gray-300 p-6 max-md:w-full w-1/2">
                      <h1 className="text-xl">Invitar usuario</h1>

                      <Select
                        className="bg-easywork-main hover:bg-easywork-mainhover text-white rounded-md w-full text-sm mt-5 mb-2"
                        onChange={e => setInvite(e.target.value)} // Maneja el evento onChange
                        value={invite} // Asigna el valor actual del estado
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="1">Mediante enlace</option>
                        <option value="2">Mediante correo electrónico o número de teléfono</option>
                        <option value="3">Masiva</option>
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

                      <InvitationFooter />
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
