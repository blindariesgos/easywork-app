"use client";
import {
  ChatBubbleBottomCenterIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  PhoneIcon,
  Bars3Icon,
  CheckIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import { FaWhatsapp } from "react-icons/fa6";
import clsx from "clsx";
import Image from "next/image";
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  Fragment,
  useCallback,
} from "react";
import useCrmContext from "@/src/context/crm";
import { useTranslation } from "react-i18next";
import { Pagination } from "@/src/components/pagination/Pagination";
import Link from "next/link";
import { deleteContactId, updateContact } from "@/src/lib/apis";
import { handleApiError } from "@/src/utils/api/errors";
import { toast } from "react-toastify";
import { useOrderByColumn } from "@/src/hooks/useOrderByColumn";
import { useContactTable } from "@/src/hooks/useCommon";
import AddColumnsTable from "@/src/components/AddColumnsTable";
import SelectedOptionsTable from "@/src/components/SelectedOptionsTable";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import DeleteItemModal from "@/src/components/modals/DeleteItem";

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { formatDate } from "@/src/utils/getFormatDate";
import useContactContext from "@/src/context/contacts";
import { useRouter } from "next/navigation";
import FooterTable from "@/src/components/FooterTable";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TableContacts() {
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenDeleteMasive, setIsOpenDeleteMasive] = useState(false);
  const { data, limit, setLimit, mutate, page, setPage } = useContactContext();
  const [deleteId, setDeleteId] = useState();
  const { t } = useTranslation();
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const router = useRouter();
  const { selectedContacts, setSelectedContacts } = useCrmContext();
  const { columnTable } = useContactTable();
  const [selectedColumns, setSelectedColumns] = useState(
    columnTable.filter((c) => c.check)
  );
  const [loading, setLoading] = useState(false);

  const [dataContacts, setDataContacts] = useState();

  const { fieldClicked, handleSorting, orderItems } = useOrderByColumn(
    [],
    data?.items
  );

  useEffect(() => {
    if (data) setDataContacts(data);
  }, [data]);

  useEffect(() => {
    if (orderItems?.length > 0)
      setDataContacts({ items: orderItems, meta: data?.meta });
  }, [orderItems]);

  useLayoutEffect(() => {
    if (checkbox.current) {
      const isIndeterminate =
        selectedContacts &&
        selectedContacts.length > 0 &&
        selectedContacts.length < dataContacts?.items.length;
      setChecked(selectedContacts?.length === dataContacts?.items?.length);
      setIndeterminate(isIndeterminate);
      checkbox.current.indeterminate = isIndeterminate;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContacts, dataContacts]);

  const toggleAll = useCallback(() => {
    setSelectedContacts(
      checked || indeterminate
        ? []
        : (dataContacts?.items?.map((x) => x.id) ?? [])
    );
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }, [checked, indeterminate, dataContacts, setSelectedContacts]);

  const deleteContacts = async () => {
    setLoading(true);
    const response = await Promise.allSettled(
      selectedContacts.map((contactId) => deleteContactId(contactId))
    );

    if (response.some((x) => x.status === "fulfilled")) {
      toast.success(
        `Se elimino con exito ${response.filter((x) => x.status == "fulfilled").length} contacto(s) de ${selectedContacts.length} seleccionado(s)`
      );
    }

    if (response.some((x) => x.status === "rejected")) {
      toast.error(
        `Ocurrio un error al tratar de eliminar ${response.filter((x) => x.status == "rejected").length} contacto(s)`
      );
    }

    setSelectedContacts([]);
    mutate();
    setLoading(false);
    setIsOpenDeleteMasive(false);
  };

  const changeResponsible = async (responsible) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("assignedById", responsible.id);

      await Promise.all(
        selectedContacts.map((id) => updateContact(formData, id))
      );
      toast.success(t("contacts:table:update-contacts"));
      setSelectedContacts([]);
    } catch (error) {
      console.log({ error });
      toast.error(t("contacts:table:update-contacts-error"));
    } finally {
      setLoading(false);
      mutate && mutate();
    }
  };

  const changeObserver = async (observer) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("observerId", observer.id);

      await Promise.all(
        selectedContacts.map((id) => updateContact(formData, id))
      );
      toast.success(t("contacts:table:update-contacts"));
      setSelectedContacts([]);
    } catch (error) {
      console.log({ error });
      toast.error(t("contacts:table:update-contacts-error"));
    } finally {
      setLoading(false);
      mutate && mutate();
    }
  };

  const masiveOptions = [
    {
      id: 1,
      name: "Agregar Observador",
      onclick: changeObserver,
      selectUser: true,
      disabled: true,
    },
    {
      id: 2,
      name: "Agregar a un Segmento",
      disabled: true,
    },
    {
      id: 3,
      name: "Cambiar Responsable",
      onclick: changeResponsible,
      selectUser: true,
    },
    // {
    //   id: 4,
    //   name: "Cambiar Observador",
    //   onclick: changeObserver,
    //   selectUser: true,
    // },
    {
      id: 5,
      name: "Crear Boletín",
      disabled: true,
    },
    {
      id: 6,
      name: t("common:buttons:delete"),
      onclick: () => setIsOpenDeleteMasive(true),
    },
    {
      id: 7,
      name: "Fusionar",
      disabled: true,
    },
    {
      id: 8,
      name: "Programar Marcación Masiva",
      disabled: true,
    },
  ];

  const deleteContact = async (id) => {
    try {
      setLoading(true);
      const response = await deleteContactId(id);
      toast.success(t("contacts:delete:msg"));
      mutate();
      setLoading(false);
      setIsOpenDelete(false);
    } catch (err) {
      setLoading(false);
      handleApiError(err.message);
    }
  };

  if (dataContacts?.items && dataContacts?.items.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-400">
            {t("contacts:table:not-data")}
          </p>
        </div>
      </div>
    );
  }

  const contactOptions = [
    {
      name: "Ver",
      handleClick: (id) =>
        router.push(`/sales/crm/contacts/contact/${id}?show=true`),
    },
    {
      name: "Editar",
      handleClick: (id) =>
        router.push(`/sales/crm/contacts/contact/${id}?show=true&edit=true`),
    },
    {
      name: "Copiar",
      handleClick: (id) =>
        router.push(`/sales/crm/contacts/contact?show=true&copy=${id}`),
    },
    {
      name: "Eliminar",
      handleClick: (id) => {
        setDeleteId(id);
        setIsOpenDelete(true);
      },
    },
    // { name: "Agregar Cita" },
    {
      name: "Planificar",
      options: [
        {
          name: "Tarea",
          handleClick: (id) =>
            router.push(
              `/tools/tasks/task?show=true&prev=contact&prev_id=${id}`
            ),
        },
        {
          name: "Whatsapp",
          disabled: true,
        },
        {
          name: "Cita",
          disabled: true,
        },
        {
          name: "Comentario",
          disabled: true,
        },
        {
          name: "Llamada",
          disabled: true,
        },
      ],
    },
  ];

  return (
    <Fragment>
      {loading && <LoaderSpinner />}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="relative sm:rounded-lg h-[60vh]">
            <table className="min-w-full rounded-md bg-gray-100 table-auto relative">
              <thead className="text-sm bg-white drop-shadow-sm sticky top-0 z-10">
                <tr>
                  <th
                    scope="col"
                    className="relative pl-4 pr-7 sm:w-12 rounded-s-xl py-5"
                  >
                    <div className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                      <AddColumnsTable
                        columns={columnTable}
                        setSelectedColumns={setSelectedColumns}
                      />
                    </div>
                  </th>
                  {selectedColumns.length > 0 &&
                    selectedColumns.map((column, index) => (
                      <th
                        key={index}
                        scope="col"
                        className={`min-w-[12rem] py-2 pr-3 text-sm font-medium text-gray-400 cursor-pointer ${
                          index === selectedColumns.length - 1 && "rounded-e-xl"
                        }`}
                        onClick={() => {
                          column.order && handleSorting(column.order);
                        }}
                      >
                        <div className="flex justify-center items-center gap-2">
                          {column.name}
                          <div>
                            {column.order && (
                              <ChevronDownIcon
                                className={`h-6 w-6 text-primary ${
                                  fieldClicked.field === column.order &&
                                  fieldClicked.sortDirection === "desc"
                                    ? "transform rotate-180"
                                    : ""
                                }`}
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
                  dataContacts?.items &&
                  dataContacts?.items.map((contact, index) => {
                    return (
                      <tr
                        key={index}
                        className={clsx(
                          selectedContacts.includes(contact.id)
                            ? "bg-gray-200"
                            : undefined,
                          "hover:bg-indigo-100/40 cursor-default"
                        )}
                      >
                        <td className="pr-7 pl-4 sm:w-12 relative">
                          {selectedContacts.includes(contact.id) && (
                            <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                          )}
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              value={contact.id}
                              checked={selectedContacts.includes(contact.id)}
                              onChange={(e) =>
                                setSelectedContacts(
                                  e.target.checked
                                    ? [...selectedContacts, contact.id]
                                    : selectedContacts.filter(
                                        (p) => p !== contact.id
                                      )
                                )
                              }
                            />
                            <Menu
                              as="div"
                              className="relative hover:bg-slate-50/30 w-10 md:w-auto py-2 rounded-lg"
                            >
                              <MenuButton className=" flex items-center">
                                <Bars3Icon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
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
                                  anchor="right start"
                                  className=" z-50 mt-2.5 rounded-md bg-white py-2 shadow-lg focus:outline-none"
                                >
                                  {contactOptions.map((item) =>
                                    !item.options ? (
                                      <MenuItem
                                        key={item.name}
                                        disabled={item.disabled}
                                        onClick={() =>
                                          item.handleClick &&
                                          item.handleClick(contact.id)
                                        }
                                      >
                                        <div
                                          // onClick={item.onClick}
                                          className={classNames(
                                            "block data-[focus]:bg-gray-50 px-3 data-[disabled]:opacity-50 py-1 text-sm leading-6 text-black cursor-pointer"
                                          )}
                                        >
                                          {item.name}
                                        </div>
                                      </MenuItem>
                                    ) : (
                                      <Menu key={item.name}>
                                        <MenuButton className="flex items-center hover:bg-gray-50">
                                          <div className="w-full flex items-center justify-between px-3 py-1 text-sm">
                                            {item.name}
                                            <ChevronRightIcon className="h-6 w-6 ml-2" />
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
                                              to: "right start",
                                              gap: "4px",
                                            }}
                                            className="rounded-md bg-white py-2 shadow-lg focus:outline-none"
                                          >
                                            {item.options.map((option) => (
                                              <MenuItem
                                                key={option.name}
                                                disabled={option.disabled}
                                                onClick={() =>
                                                  option.handleClick &&
                                                  option.handleClick(contact.id)
                                                }
                                              >
                                                <div
                                                  className={clsx(
                                                    "block px-3 py-1 text-sm leading-6 text-black cursor-pointer data-[focus]:bg-gray-50 data-[disabled]:opacity-50"
                                                  )}
                                                >
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
                            <td className="ml-4 text-center py-4" key={index}>
                              <div className="font-medium text-sm text-black hover:text-primary capitalize">
                                {column.link ? (
                                  <Link
                                    href={`/sales/crm/contacts/contact/${contact.id}?show=true`}
                                    className="flex gap-3 items-center"
                                  >
                                    <Image
                                      className="h-8 w-8 rounded-full bg-zinc-200"
                                      width={30}
                                      height={30}
                                      src={contact.photo || "/img/avatar.svg"}
                                      alt=""
                                    />
                                    <p className="text-start">
                                      {contact?.fullName ?? `${contact?.name}`}
                                    </p>
                                  </Link>
                                ) : column.row === "responsible" ? (
                                  <div className="flex items-center justify-center">
                                    {contact?.assignedBy?.username ? (
                                      <div className="flex items-center gap-3">
                                        <Image
                                          className="h-8 w-8 rounded-full bg-zinc-200"
                                          width={30}
                                          height={30}
                                          src={
                                            contact?.assignedBy?.avatar ||
                                            "/img/avatar.svg"
                                          }
                                          alt=""
                                        />
                                        <div>
                                          <p>{`${contact?.assignedBy?.profile?.firstName} ${contact?.assignedBy?.profile?.lastName}`}</p>
                                          <p className="text-xs text-left">
                                            {contact?.assignedBy?.bio}
                                          </p>
                                        </div>
                                      </div>
                                    ) : (
                                      "N/A"
                                    )}
                                  </div>
                                ) : column.activities ? (
                                  <div className="flex justify-center gap-2">
                                    <button
                                      type="button"
                                      className="rounded-full bg-green-100 p-1 text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                    >
                                      <FaWhatsapp
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <button
                                      type="button"
                                      className="rounded-full bg-primary p-1 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                    >
                                      <EnvelopeIcon
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <button
                                      type="button"
                                      className="rounded-full bg-primary p-1 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                    >
                                      <ChatBubbleBottomCenterIcon
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <button
                                      type="button"
                                      className="rounded-full bg-primary p-1 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                    >
                                      <PhoneIcon
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  </div>
                                ) : column.row === "email" ? (
                                  contact.email ? (
                                    <span className="lowercase text-xs">
                                      {contact.email}
                                    </span>
                                  ) : (
                                    "-"
                                  )
                                ) : column.row === "phone" ? (
                                  contact.phone ? (
                                    `+${contact.phone}`
                                  ) : (
                                    "-"
                                  )
                                ) : column.row === "birthdate" ? (
                                  (formatDate(
                                    contact.birthdate,
                                    "dd/MM/yyyy"
                                  ) ?? null)
                                ) : column.row === "createdAt" ? (
                                  (formatDate(
                                    contact.createdAt,
                                    "dd/MM/yyyy"
                                  ) ?? null)
                                ) : column.row === "source" ? (
                                  contact?.source?.name
                                ) : (
                                  "-"
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
      <div className="w-full mt-1 pt-4 sm:pt-0">
        <FooterTable
          limit={limit}
          setLimit={setLimit}
          page={page}
          setPage={setPage}
          totalPages={data?.meta?.totalPages}
          total={data?.meta?.totalItems ?? 0}
        />
        <div className="flex">
          {selectedContacts.length > 0 && (
            <SelectedOptionsTable options={masiveOptions} />
          )}
        </div>
      </div>
      {/* Delete ConfirmModal */}
      <DeleteItemModal
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        handleClick={() => deleteContact(deleteId)}
      />

      <DeleteItemModal
        isOpen={isOpenDeleteMasive}
        setIsOpen={setIsOpenDeleteMasive}
        handleClick={() => deleteContacts()}
      />
    </Fragment>
  );
}
