'use client';
import { ChatBubbleBottomCenterIcon, ChevronDownIcon, EnvelopeIcon, PhoneIcon, Bars3Icon, CheckIcon } from '@heroicons/react/20/solid';
import { FaWhatsapp } from 'react-icons/fa6';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useEffect, useLayoutEffect, useRef, useState, Fragment, useCallback } from 'react';
import useCrmContext from '@/src/context/crm';
import { useTranslation } from 'react-i18next';
import { Pagination } from '@/src/components/pagination/Pagination';
import Link from 'next/link';
import { deleteContactId, toggleActiveUser } from '@/src/lib/apis';
import { handleApiError } from '@/src/utils/api/errors';
import { toast } from 'react-toastify';
import { useOrderByColumn } from '@/src/hooks/useOrderByColumn';
import { useUserTable } from '@/src/hooks/useCommon';
import AddColumnsTable from '@/src/components/AddColumnsTable';
import SelectedOptionsTable from '@/src/components/SelectedOptionsTable';
import { useAlertContext } from '@/src/context/common/AlertContext';
import LoaderSpinner from '@/src/components/LoaderSpinner';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { formatDate } from '@/src/utils/getFormatDate';
import useUserContext from '@/src/context/users';
import { useRouter } from 'next/navigation';
import FooterTable from '@/src/components/FooterTable';
import Table from '@/src/components/Table';
import moment from 'moment';

import { ToggleActiveUserModal } from '../components/ToggleActiveUserModal';

export default function TableUsers() {
  const { data, limit, setLimit, setOrderBy, order, orderBy, mutate, page, setPage } = useUserContext();
  const { t } = useTranslation();
  const router = useRouter();
  const { selectedContacts, setSelectedContacts } = useCrmContext();
  const { columnTable } = useUserTable();
  const [selectedColumns, setSelectedColumns] = useState(columnTable.filter(c => c.check));
  const { onCloseAlertDialog } = useAlertContext();
  const [loading, setLoading] = useState(false);
  const [isOpenToggleActiveUserModal, setIsOpenToggleActiveUserModal] = useState(false);
  const toggleActiveUserInfo = useRef(null);

  // updateStatusUser(id, user.isActive);

  const deleteContact = contact => {
    if (contact.length === 1) apiDelete(contact[0].id);
    if (contact.length > 1) {
      contact.map(cont => apiDelete(cont.id));
    }
    toast.success(t('contacts:delete:msg'));
    setSelectedContacts([]);
    onCloseAlertDialog();
  };

  const options = [
    {
      id: 1,
      name: t('common:buttons:delete'),
      onclick: () => deleteContact(selectedContacts),
    },
  ];

  const apiDelete = async id => {
    try {
      setLoading(true);
      const response = await deleteContactId(id);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      handleApiError(err.message);
    }
  };

  const updateStatusUser = async (id, isActive) => {
    try {
      await toggleActiveUser(id, {
        isActive: !isActive,
      });

      mutate();

      toast[isActive ? 'success' : 'info'](`Usuario ${isActive ? 'activado con éxito' : 'desactivado'}`);
    } catch {
      toast.error('Ha ocurrido un error al intentar actualizar el usuario. Por favor intente más tarde');
    }
  };

  const itemOptions = user => [
    {
      name: 'Ver',
      handleClick: id => router.push(`/settings/permissions/users/user/${id}?show=true`),
    },
    { name: 'Editar' },
    { name: 'Copiar' },
    (() => {
      return {
        name: user.isActive ? 'Desactivar' : 'Activar',
        handleClick: id => {
          toggleActiveUserInfo.current = {
            id,
            isActive: user.isActive,
          };

          setIsOpenToggleActiveUserModal(true);
        },
      };
    })(),
  ];

  return (
    <Fragment>
      {loading && <LoaderSpinner />}
      {selectedContacts.length > 0 && (
        <div className="flex">
          <SelectedOptionsTable options={options} />
        </div>
      )}
      <Table
        selectedRows={selectedContacts}
        setSelectedRows={setSelectedContacts}
        data={data}
        order={order}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
        columnTable={columnTable}
      >
        {selectedColumns.length > 0 &&
          data?.items &&
          data?.items.map((user, index) => {
            return (
              <tr key={index} className={clsx(selectedContacts.includes(user.id) ? 'bg-gray-200' : undefined, 'hover:bg-indigo-100/40 cursor-default')}>
                <td className="pr-7 pl-4 sm:w-12">
                  {selectedContacts.includes(user) && <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      value={user.id}
                      checked={selectedContacts.includes(user)}
                      onChange={e => setSelectedContacts(e.target.checked ? [...selectedContacts, user] : selectedContacts.filter(p => p !== user))}
                    />

                    <Menu as="div" className="relative hover:bg-slate-50/30 w-10 md:w-auto py-2 rounded-lg">
                      <MenuButton className="flex items-center">
                        <Bars3Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </MenuButton>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <MenuItems anchor="right start" className="z-50 mt-2.5 rounded-md bg-white py-2 shadow-lg focus:outline-none">
                          {itemOptions(user).map(item => (
                            <MenuItem key={item.name} onClick={() => item.handleClick && item.handleClick(user.id)}>
                              <div className="bg-gray-50 block px-3 py-1 text-sm leading-6 text-black cursor-pointer">{item.name}</div>
                            </MenuItem>
                          ))}
                        </MenuItems>
                      </Transition>
                    </Menu>
                  </div>
                </td>
                {selectedColumns.length > 0 &&
                  selectedColumns.map((column, index) => (
                    <td className="ml-4 py-4" key={index}>
                      <div className="font-medium text-sm text-black text-center hover:text-primary">
                        {column.link ? (
                          <Link href={`/settings/permissions/users/user/${user.id}?show=true`} className="flex gap-3 items-center">
                            <Image className="h-8 w-8 rounded-full bg-zinc-200" width={30} height={30} src={user.avatar || '/img/avatar.svg'} alt="" />
                            <div className="flex flex-col">
                              <p className="text-start">{user?.profile ? `${user?.profile?.firstName} ${user?.profile?.lastName}` : user?.username}</p>
                              {user.bio && <p className="text-start text-xs">{user?.bio}</p>}
                            </div>
                          </Link>
                        ) : column.activities ? (
                          <div className="flex justify-center gap-2">
                            <button
                              type="button"
                              className="rounded-full bg-green-100 p-1 text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                              <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              className="rounded-full bg-primary p-1 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                              <EnvelopeIcon className="h-4 w-4" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              className="rounded-full bg-primary p-1 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                              <ChatBubbleBottomCenterIcon className="h-4 w-4" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              className="rounded-full bg-primary p-1 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                              <PhoneIcon className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>
                        ) : column.row === 'mobile-app' || column.row === 'desk-app' ? (
                          'No Instalado'
                        ) : column.row === 'email' ? (
                          (user.email ?? '-')
                        ) : column.row === 'phone' ? (
                          user.phone.length > 0 ? (
                            `+${user.phone}`
                          ) : (
                            '-'
                          )
                        ) : column.row === 'lastLogin' ? (
                          user.lastLogin ? (
                            moment(user.lastLogin).format('DD/MM/YYYY, hh:mm a')
                          ) : (
                            '-'
                          )
                        ) : (
                          user[column.row] || '-'
                        )}
                      </div>
                    </td>
                  ))}
              </tr>
            );
          })}
      </Table>

      <ToggleActiveUserModal
        isOpen={isOpenToggleActiveUserModal}
        setIsOpen={setIsOpenToggleActiveUserModal}
        isActive={toggleActiveUserInfo.current?.isActive}
        onClose={() => {
          toggleActiveUserInfo.current = null;
        }}
        onSuccess={() => {
          if (!toggleActiveUserInfo.current) return;

          updateStatusUser(toggleActiveUserInfo.current.id, toggleActiveUserInfo.current.isActive);
          setIsOpenToggleActiveUserModal(false);
        }}
      />

      <div className="w-full pt-2">
        <FooterTable limit={limit} setLimit={setLimit} page={page} setPage={setPage} totalPages={data?.meta?.totalPages} total={data?.meta?.totalItems ?? 0} />
      </div>
    </Fragment>
  );
}
