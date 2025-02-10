'use client';
import { ChatBubbleBottomCenterIcon, ChevronDownIcon, EnvelopeIcon, PhoneIcon, Bars3Icon, CheckIcon, ChevronDoubleDownIcon } from '@heroicons/react/20/solid';
import { FaWhatsapp } from 'react-icons/fa6';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useEffect, useLayoutEffect, useRef, useState, Fragment, useCallback } from 'react';
import useCrmContext from '@/src/context/crm';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { deletePolicyById, putPoliza } from '@/src/lib/apis';
import { handleApiError } from '@/src/utils/api/errors';
import { toast } from 'react-toastify';
import { useCapacitationsTable } from '../../../../../../hooks/useCommon';
import AddColumnsTable from '@/src/components/AddColumnsTable';
import SelectedOptionsTable from '@/src/components/SelectedOptionsTable';
import { useAlertContext } from '@/src/context/common/AlertContext';
import LoaderSpinner from '@/src/components/LoaderSpinner';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { formatDate } from '@/src/utils/getFormatDate';
import useCapacitationsContext from '@/src/context/capacitations';
import { useRouter } from 'next/navigation';
import { formatToCurrency } from '@/src/utils/formatters';
import useAppContext from '@/src/context/app';
import FooterTable from '@/src/components/FooterTable';
import DeleteItemModal from '@/src/components/modals/DeleteItem';
import { CapacitationStageProgress } from '../components/CapacitationStageProgress';

export default function Table() {
  const { data, limit, setLimit, setOrderBy, order, orderBy, page, setPage, mutate } = useCapacitationsContext();
  const { t } = useTranslation();
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const router = useRouter();
  const { selectedContacts, setSelectedContacts } = useCrmContext();
  const { columnTable } = useCapacitationsTable();
  const [selectedColumns, setSelectedColumns] = useState(columnTable.filter(c => c.check));
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [isOpenDeleteMasive, setIsOpenDeleteMasive] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  useLayoutEffect(() => {
    if (checkbox.current) {
      const isIndeterminate = selectedContacts && selectedContacts?.length > 0 && selectedContacts?.length < data?.items?.length;
      setChecked(selectedContacts?.length === data?.items?.length);
      setIndeterminate(isIndeterminate);
      checkbox.current.indeterminate = isIndeterminate;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContacts, data]);

  const toggleAll = useCallback(() => {
    setSelectedContacts(checked || indeterminate ? [] : data?.items);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }, [checked, indeterminate, data, setSelectedContacts]);

  const deletePolicy = async id => {
    try {
      setLoading(true);
      const response = await deletePolicyById(id);
      toast.success(t('common:alert:delete-success'));
      mutate();
      setLoading(false);
      setIsOpenDelete(false);
    } catch (err) {
      setLoading(false);
      handleApiError(err.message);
    }
  };

  const deletePolicies = async () => {
    setLoading(true);
    const response = await Promise.allSettled(selectedContacts.map(policyId => deletePolicyById(policyId)));
    if (response.some(x => x.status === 'fulfilled')) {
      toast.success(
        `Se elimino con éxito ${response.filter((x) => x.status == "fulfilled").length} elemento(s) de ${selectedContacts.length} seleccionado(s)`
      );
    }

    if (response.some(x => x.status === 'rejected')) {
      toast.error(`Ocurrio un error al tratar de eliminar ${response.filter(x => x.status == 'rejected').length} elementos(s)`);
    }

    setSelectedContacts([]);
    mutate();
    setLoading(false);
    setIsOpenDeleteMasive(false);
  };

  const changeStatusPolicies = async status => {
    setLoading(true);
    const body = {
      status: status.id,
    };
    const response = await Promise.allSettled(selectedContacts.map(policyId => putPoliza(policyId, body)));
    if (response.some(x => x.status === 'fulfilled' && !x?.value?.hasError)) {
      toast.success(
        t('common:alert:update-items-succes', {
          count: response.filter(x => x.status == 'fulfilled' && !x?.value?.hasError).length,
          total: selectedContacts.length,
        })
      );
    }

    if (response.some(x => x.status === 'rejected' || x?.value?.hasError)) {
      toast.error(
        t('common:alert:update-items-error', {
          count: response.filter(x => x.status == 'rejected' || x?.value?.hasError).length,
        })
      );
    }

    setSelectedContacts([]);
    mutate();
    setLoading(false);
  };

  const changeResponsible = async responsible => {
    const body = {
      assignedById: responsible.id,
    };
    const response = await Promise.allSettled(selectedContacts.map(policyId => putPoliza(policyId, body)));

    if (response.some(x => x.status === 'fulfilled' && !x?.value?.hasError)) {
      toast.success(
        t('common:alert:update-items-succes', {
          count: response.filter(x => x.status == 'fulfilled' && !x?.value?.hasError).length,
          total: selectedContacts.length,
        })
      );
    }

    if (response.some(x => x.status === 'rejected' || x?.value?.hasError)) {
      toast.error(
        t('common:alert:update-items-error', {
          count: response.filter(x => x.status == 'rejected' || x?.value?.hasError).length,
        })
      );
    }

    setSelectedContacts([]);
    mutate();
    setLoading(false);
  };

  const masiveActions = [
    {
      id: 1,
      name: 'Asignar agente relacionado - subagente',
      disabled: true,
    },
    {
      id: 1,
      name: 'Asignar observador',
      disabled: true,
    },
    {
      id: 3,
      name: 'Cambiar Responsable',
      onclick: changeResponsible,
      selectUser: true,
    },
    {
      id: 2,
      name: t('common:table:checkbox:change-status'),
      onclick: changeStatusPolicies,
      selectOptions: [
        {
          id: 'activa',
          name: 'Activa',
        },
        {
          id: 'expirada',
          name: 'Expirada',
        },
        {
          id: 'cancelada',
          name: 'Cancelada',
        },
        {
          id: 'en_proceso',
          name: 'En proceso',
        },
      ],
    },
    {
      id: 1,
      name: 'Crear tarea',
      disabled: true,
    },
    {
      id: 1,
      name: t('common:buttons:delete'),
      onclick: () => setIsOpenDeleteMasive(true),
      disabled: true,
    },
  ];

  const itemActions = [
    {
      name: 'Ver',
      handleClick: id => router.push(`/operations/renovations/renovation/${id}?show=true`),
    },
    {
      name: 'Editar',
      handleClick: id => router.push(`/operations/renovations/renovation/${id}?show=true&edit=true`),
    },
    {
      name: 'Eliminar',
      handleClick: id => {
        setDeleteId(id);
        setIsOpenDelete(true);
      },
      disabled: true,
    },
    {
      name: 'Planificar',
      options: [
        {
          name: 'Tarea',
          handleClickContact: id => router.push(`/tools/tasks/task?show=true&prev=renovations&prev_id=${id}`),
          disabled: true,
        },
        {
          name: 'Cita',
          disabled: true,
        },
        {
          name: 'Comentario',
          disabled: true,
        },
        {
          name: 'Correo',
          disabled: true,
        },
      ],
    },
  ];

  if (data?.items && data?.items.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-400">{t('operations:policies:table:not-data')}</p>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      {loading && <LoaderSpinner />}
      {selectedContacts.length > 0 && (
        <div className="flex py-2">
          <SelectedOptionsTable options={masiveActions} />
        </div>
      )}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="relative sm:rounded-lg h-[60vh]">
            <table className="min-w-full rounded-md bg-gray-100 table-auto relative">
              <thead className="text-sm bg-white drop-shadow-sm sticky top-0 z-10">
                <tr>
                  <th scope="col" className="relative px-4  rounded-xl py-5 flex gap-2 items-center">
                    <input type="checkbox" className=" h-4 w-4 border-gray-300 text-primary focus:ring-primary" ref={checkbox} checked={checked} onChange={toggleAll} />
                    <AddColumnsTable columns={columnTable} setSelectedColumns={setSelectedColumns} />
                  </th>
                  {selectedColumns.length > 0 &&
                    selectedColumns.map((column, index) => (
                      <th
                        key={index}
                        scope="col"
                        className={`min-w-[12rem] py-2 pr-3 text-sm font-medium text-gray-400 cursor-pointer ${index === selectedColumns.length - 1 && 'rounded-e-xl'}`}
                        onClick={() => {
                          column.order && setOrderBy(column.order);
                        }}
                      >
                        <div className="flex justify-center items-center gap-2">
                          {column.name}
                          <div>
                            {column.order && (
                              <ChevronDownIcon
                                className={clsx('h-6 w-6', {
                                  'text-primary': orderBy === column.order,
                                  'transform rotate-180': orderBy === column.order && order === 'ASC',
                                })}
                              />
                            )}
                          </div>
                        </div>
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="bg-gray-100">
                {selectedColumns.length > 0 &&
                  data?.items &&
                  data?.items.map((capacitation, index) => {
                    return (
                      <tr key={index} className={clsx(selectedContacts.includes(capacitation.id) ? 'bg-gray-200' : undefined, 'hover:bg-indigo-100/40 cursor-default')}>
                        <td className="pr-7 pl-4 sm:w-12 relative">
                          {selectedContacts.includes(capacitation.id) && <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />}
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              value={capacitation.id}
                              checked={selectedContacts.includes(capacitation.id)}
                              onChange={e => setSelectedContacts(e.target.checked ? [...selectedContacts, capacitation.id] : selectedContacts.filter(p => p !== capacitation.id))}
                            />
                            <Menu as="div" className="relative hover:bg-slate-50/30 w-10 md:w-auto py-2 px-1 rounded-lg">
                              <MenuButton className="-m-1.5 flex items-center p-1.5">
                                <Bars3Icon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
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
                                <MenuItems anchor="right start" className=" z-50 mt-2.5  rounded-md bg-white py-2 shadow-lg focus:outline-none">
                                  {itemActions.map(item =>
                                    !item.options ? (
                                      <MenuItem
                                        key={item.name}
                                        disabled={item.disabled}
                                        onClick={() => {
                                          item.handleClick && item.handleClick(capacitation.id);
                                          item.handleClickContact && item.handleClickContact(capacitation?.contact?.id);
                                        }}
                                      >
                                        <div
                                          // onClick={item.onClick}
                                          className={'block data-[focus]:bg-gray-50 px-3 data-[disabled]:opacity-50 py-1 text-sm leading-6 text-black cursor-pointer'}
                                        >
                                          {item.name}
                                        </div>
                                      </MenuItem>
                                    ) : (
                                      <Menu key={item.name}>
                                        <MenuButton className="flex items-center hover:bg-gray-50">
                                          <div className="w-full flex items-center justify-between px-3 py-1 text-sm">
                                            {item.name}
                                            <ChevronDownIcon className="h-6 w-6 ml-2" />
                                          </div>
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
                                          <MenuItems
                                            anchor={{
                                              to: 'right start',
                                              gap: '4px',
                                            }}
                                            className="rounded-md bg-white py-2 shadow-lg focus:outline-none"
                                          >
                                            {item.options.map(option => (
                                              <MenuItem
                                                key={option.name}
                                                disabled={option.disabled}
                                                onClick={() => {
                                                  option.handleClick && option.handleClick(capacitation.id);
                                                  option.handleClickContact && option.handleClickContact(capacitation?.contact?.id);
                                                }}
                                              >
                                                <div className={clsx('block px-3 py-1 text-sm leading-6 text-black cursor-pointer data-[focus]:bg-gray-50 data-[disabled]:opacity-50')}>
                                                  {option.name}
                                                </div>
                                              </MenuItem>
                                            ))}
                                          </MenuItems>
                                        </Transition>
                                      </Menu>
                                    )
                                  )}
                                </MenuItems>
                              </Transition>
                            </Menu>
                          </div>
                        </td>
                        {selectedColumns.length > 0 &&
                          selectedColumns.map((column, index) => (
                            <td className="ml-4 py-4" key={index}>
                              <div className="font-medium text-sm  text-black hover:text-primary text-center">
                                {column.row == 'name' ? (
                                  <p>{`${capacitation?.name}`}</p>
                                ) : column.row == 'activities' ? (
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
                                ) : column.row === 'stage' ? (
                                  <>
                                    {capacitation[column.row] && (
                                      <>
                                        <CapacitationStageProgress stage={capacitation[column.row]} />
                                        <p className="text-gray-50" style={{ fontSize: '0.7rem' }}>
                                          Ejemplo
                                        </p>
                                      </>
                                    )}
                                  </>
                                ) : column.row === 'startDate' ? (
                                  (formatDate(capacitation[column.row], 'dd/MM/yyyy') ?? null)
                                ) : column.row === 'endDate' ? (
                                  (formatDate(capacitation[column.row], 'dd/MM/yyyy') ?? null)
                                ) : column.row === 'processClosed' ? (
                                  capacitation[column.row] ? (
                                    'Si'
                                  ) : (
                                    'No'
                                  )
                                ) : column.row === 'responsible' ? (
                                  (capacitation[column.row] ?? null)
                                ) : (
                                  capacitation[column.row] || '-'
                                )}
                              </div>
                            </td>
                          ))}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="w-full pt-4 ">
        <FooterTable limit={limit} setLimit={setLimit} page={page} setPage={setPage} totalPages={data?.meta?.totalPages} total={data?.meta?.totalItems ?? 0} />
      </div>
      <DeleteItemModal isOpen={isOpenDelete} setIsOpen={setIsOpenDelete} handleClick={() => deletePolicy(deleteId)} loading={loading} />
      <DeleteItemModal isOpen={isOpenDeleteMasive} setIsOpen={setIsOpenDeleteMasive} handleClick={() => deletePolicies()} loading={loading} />
    </Fragment>
  );
}
