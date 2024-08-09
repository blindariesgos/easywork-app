"use client";
import {
  ChatBubbleBottomCenterIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  PhoneIcon,
  Bars3Icon,
  CheckIcon,
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
import { deleteContactId } from "@/src/lib/apis";
import { handleApiError } from "@/src/utils/api/errors";
import { toast } from "react-toastify";
import { useOrderByColumn } from "@/src/hooks/useOrderByColumn";
import { useContactTable } from "@/src/hooks/useCommon";
import AddColumnsTable from "@/src/components/AddColumnsTable";
import SelectedOptionsTable from "@/src/components/SelectedOptionsTable";
import { useAlertContext } from "@/src/context/common/AlertContext";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from "@headlessui/react";
import { formatDate } from "@/src/utils/getFormatDate";
import useContactContext from "@/src/context/contacts";
import { itemsByPage } from "@/src/lib/common";
import { useRouter } from "next/navigation";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TableContacts() {
  const { data, limit, setLimit } = useContactContext()
  const { t } = useTranslation();
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const router = useRouter()
  const {
    setLastContactsUpdate,
    selectedContacts,
    setSelectedContacts,
  } = useCrmContext();
  const { columnTable } = useContactTable();
  const [selectedColumns, setSelectedColumns] = useState(
    columnTable.filter((c) => c.check)
  );
  const { onCloseAlertDialog } = useAlertContext();
  const [loading, setLoading] = useState(false);

  const [dataContacts, setDataContacts] = useState();

  const { fieldClicked, handleSorting, orderItems } = useOrderByColumn(
    [],
    data?.items
  );

  useEffect(() => {
    if (data) setDataContacts(data)
  }, [data])

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
    setSelectedContacts(checked || indeterminate ? [] : dataContacts?.items);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }, [checked, indeterminate, dataContacts, setSelectedContacts]);

  const deleteContact = (contact) => {
    if (contact.length === 1) apiDelete(contact[0].id);
    if (contact.length > 1) {
      contact.map((cont) => apiDelete(cont.id));
    }
    toast.success(t("contacts:delete:msg"));
    setSelectedContacts([]);
    onCloseAlertDialog();
  };

  const options = [
    {
      id: 1,
      name: t("common:buttons:delete"),
      onclick: () => deleteContact(selectedContacts),
    },
  ];

  const apiDelete = async (id) => {
    try {
      setLoading(true);
      const response = await deleteContactId(id);
      setLastContactsUpdate(response);
      setLoading(false);
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

  const itemOptions = [
    {
      name: "Ver",
      handleClick: (id) => router.push(`/settings/permissions/permissions/user/${id}?show=true`)
    },
    { name: "Editar" },
    { name: "Copiar" },
    { name: "Eliminar" },
    { name: "Agregar Evento" },
    { name: "Nuevo correo electrónico" },
  ];

  return (
    <>
      {loading && <LoaderSpinner />}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="relative sm:rounded-lg h-[60vh]">
            <table className="min-w-full rounded-md bg-gray-100 table-auto">
              <thead className="text-sm bg-white drop-shadow-sm">
                <tr>
                  <th
                    scope="col"
                    className="relative px-7 sm:w-12 sm:px-6 rounded-s-xl py-5"
                  >
                    <input
                      type="checkbox"
                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      ref={checkbox}
                      checked={checked}
                      onChange={toggleAll}
                    />
                    <AddColumnsTable
                      columns={columnTable}
                      setSelectedColumns={setSelectedColumns}
                    />
                  </th>
                  {selectedColumns.length > 0 &&
                    selectedColumns.map((column, index) => (
                      <th
                        key={index}
                        scope="col"
                        className={`min-w-[12rem] py-2 pr-3 text-sm font-medium text-gray-400 cursor-pointer ${index === selectedColumns.length - 1 && "rounded-e-xl"
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
                                className={`h-6 w-6 text-primary ${fieldClicked.field === column.order &&
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
                          selectedContacts.includes(contact)
                            ? "bg-gray-200"
                            : undefined,
                          "hover:bg-indigo-100/40 cursor-default"
                        )}
                      >
                        <td className="pr-7 pl-4 sm:w-12">
                          {selectedContacts.includes(contact) && (
                            <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                          )}
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              value={contact.id}
                              checked={selectedContacts.includes(contact)}
                              onChange={(e) =>
                                setSelectedContacts(
                                  e.target.checked
                                    ? [...selectedContacts, contact]
                                    : selectedContacts.filter(
                                      (p) => p !== contact
                                    )
                                )
                              }
                            />

                            <Menu
                              as="div"
                              className="relative hover:bg-slate-50/30 w-10 md:w-auto py-2 px-1 rounded-lg"
                            >
                              <MenuButton className="-m-1.5 flex items-center p-1.5">
                                <Bars3Icon
                                  className="ml-3 h-5 w-5 text-gray-400"
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
                                <MenuItems className="absolute left-0 z-50 mt-2.5 w-48 rounded-md bg-white py-2 shadow-lg focus:outline-none">
                                  {itemOptions.map((item) => (
                                    <MenuItem key={item.name} onClick={() => item.handleClick && item.handleClick(contact.id)}>
                                      {({ active }) => (
                                        <div
                                          // onClick={item.onClick}
                                          className={classNames(
                                            active ? "bg-gray-50" : "",
                                            "block px-3 py-1 text-sm leading-6 text-black cursor-pointer"
                                          )}
                                        >
                                          {item.name}
                                        </div>
                                      )}
                                    </MenuItem>
                                  ))}
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
                                    href={`/settings/permissions/users/user/${contact.id}?show=true`}
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

                                    <div className="ml-4 flex">
                                      <p className="text-start">
                                        {contact?.responsibleUser?.name ?? "N/A"}
                                      </p>
                                    </div>
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
                                  contact.emails?.length > 0 ? (
                                    contact.emails[0].email.email
                                  ) : (
                                    "-"
                                  )
                                ) : column.row === "phone" ? (
                                  contact.phones?.length > 0 ? (
                                    `+${contact.phones[0].phone.number}`
                                  ) : (
                                    "-"
                                  )
                                ) : column.row === "birthdate" ? (
                                  formatDate(contact.birthdate, "dd/MM/yyyy")
                                  ?? null
                                ) : column.row === "createdAt" ? (
                                  formatDate(contact.createdAt, "dd/MM/yyyy")
                                  ?? null
                                ) : (
                                  contact[column.row] || "-"
                                )}
                              </div>
                            </td>
                          ))}
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="w-full mt-1 pt-4 sm:pt-0">
        <div className="flex justify-center">
          <div className="flex gap-1 items-center">
            <p>Mostrar:</p>
            <Listbox value={limit} onChange={setLimit} as="div">
              <ListboxButton
                className={clsx(
                  'relative block w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6',
                  'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2'
                )}
              >
                {limit}
                <ChevronDownIcon
                  className="group pointer-events-none absolute top-2.5 right-2.5 size-4 "
                  aria-hidden="true"
                />
              </ListboxButton>
              <ListboxOptions
                anchor="bottom"
                transition
                className={clsx(
                  'rounded-xl border border-white p-1 focus:outline-none bg-white shadow-2xl',
                  'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                )}
              >
                {itemsByPage.map((page) => (
                  <ListboxOption
                    key={page.name}
                    value={page.id}
                    className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-primary data-[focus]:text-white"
                  >
                    <CheckIcon className="invisible size-4 group-data-[selected]:visible" />
                    <div className="text-sm/6">{page.name}</div>
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Listbox>
          </div>
          <Pagination totalPages={dataContacts?.meta?.totalPages || 0} />
        </div>
        <div className="flex">
          {selectedContacts.length > 0 && (
            <SelectedOptionsTable options={options} />
          )}
        </div>
      </div>
    </>
  );
}
