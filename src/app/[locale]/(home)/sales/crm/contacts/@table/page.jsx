"use client";
import {
  ChatBubbleBottomCenterIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/20/solid";
import { FaWhatsapp } from "react-icons/fa6";
import clsx from "clsx";
import Image from "next/image";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import useCrmContext from "../../../../../../../context/crm";
import { getURLContactPhoto } from "../../../../../../../lib/common";
import useAppContext from "../../../../../../../context/app";
import { useTranslation } from "react-i18next";
import { Pagination } from "../../../../../../../components/pagination/Pagination";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Cog8ToothIcon } from "@heroicons/react/20/solid";
import Button from "../../../../../../../components/form/Button";
import { deleteContactId } from "../../../../../../../lib/apis";
import { handleApiError } from "../../../../../../../utils/api/errors";
import { toast } from "react-toastify";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { useOrderByColumn } from "../../../../../../../hooks/useOrderByColumn";
import { useContactTable } from "../../../../../../../hooks/useCommon";
import AddColumnsTable from "../../../../../../../components/AddColumnsTable";
import SelectedOptionsTable from "../../../../../../../components/SelectedOptionsTable";
import { useAlertContext } from "../../../../../../../context/common/AlertContext";
import LoaderSpinner from "../../../../../../../components/LoaderSpinner";

export default function Page() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentPage = Number(params?.page) || 1;
  const { t } = useTranslation();
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const {
    contacts: AppContacts,
    setLastContactsUpdate,
    setContacts,
    selectedContacts,
    setSelectedContacts,
  } = useCrmContext();
  const { columnTable } = useContactTable();
  const [selectedColumns, setSelectedColumns] = useState(
    columnTable.filter((c) => c.check)
  );
  const { onCloseAlertDialog } = useAlertContext();
  const [loading, setLoading] = useState(false);
  const sortFieltByColumn = {
    name: ["fullName"],
  };
  const { fieldClicked, handleSorting, orderItems } = useOrderByColumn(
    sortFieltByColumn,
    AppContacts?.items
  );

  useEffect(() => {
    if (orderItems.length > 0)
      setContacts({ items: orderItems, meta: AppContacts?.meta });
  }, [orderItems, setContacts, AppContacts]);

  useLayoutEffect(() => {
    if (checkbox.current) {
      const isIndeterminate =
        selectedContacts &&
        selectedContacts.length > 0 &&
        selectedContacts.length < AppContacts?.items.length;
      setChecked(selectedContacts?.length === AppContacts?.items?.length);
      setIndeterminate(isIndeterminate);
      checkbox.current.indeterminate = isIndeterminate;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContacts]);

  function toggleAll() {
    setSelectedContacts(checked || indeterminate ? [] : AppContacts?.items);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  const capitalizedText = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

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

  if (AppContacts?.items && AppContacts?.items.length === 0) {
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

  return (
    <div className="flow-root relative h-full">
      {loading && <LoaderSpinner />}
      <div className="overflow-x-auto overflow-y-hidden">
        <div className="inline-block min-w-full py-2 align-middle sm:h-[32rem] overflow-y-hidden">
          <div className="relative overflow-hidden  sm:rounded-lg">
            {/* {selectedContacts && selectedContacts.length > 0 && (
              <div className="absolute left-16 top-2 flex h-12 items-center space-x-3 bg-white sm:left-16">
                <Button
                  label={t('common:buttons:delete')}
                  type="button"
                  className="px-2 py-2"
                  buttonStyle="secondary"
                  onclick={() => deleteContact(selectedContacts)}
                />
              </div>
            )} */}
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
                  AppContacts?.items &&
                  AppContacts?.items.map((contact, index) => (
                    <tr
                      key={index}
                      className={clsx(
                        selectedContacts.includes(contact)
                          ? "bg-gray-200"
                          : undefined,
                        "hover:bg-indigo-100/40 cursor-default"
                      )}
                    >
                      <td className=" px-7 sm:w-12 sm:px-6">
                        {selectedContacts.includes(contact) && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                        )}
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          value={contact.id}
                          checked={selectedContacts.includes(contact)}
                          onChange={(e) =>
                            setSelectedContacts(
                              e.target.checked
                                ? [...selectedContacts, contact]
                                : selectedContacts.filter((p) => p !== contact)
                            )
                          }
                        />
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
                                    {contact[column.row]}
                                  </p>
                                </Link>
                              ) : column.row === "responsible" ? (
                                <div className="flex items-center justify-center">
                                  {/* <div className="h-9 w-9 flex-shrink-0">
                                  <Image
                                    className="h-8 w-8 rounded-full"
                                    width={30}
                                    height={30}
                                    src={"/img/avatar.svg"}
                                    alt=""
                                  />
                                </div> */}
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
                                  ""
                                )
                              ) : column.row === "phone" ? (
                                contact.phones?.length > 0 ? (
                                  `+${contact.phones[0].phone.number}`
                                ) : (
                                  ""
                                )
                              ) : column.row === "birthdate" ? (
                                new Date(
                                  contact.birthdate
                                ).toLocaleDateString() ?? null
                              ) : column.row === "createdAt" ? (
                                new Date(
                                  contact.createdAt
                                ).toLocaleDateString() ?? null
                              ) : (
                                contact[column.row] || "-"
                              )}
                            </div>
                          </td>
                        ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="w-full mt-1 pt-4 sm:pt-0 flex justify-center">
        <div className="flex justify-between items-center flex-wrap gap-4">
          {selectedContacts.length > 0 && (
            <SelectedOptionsTable options={options} />
          )}
          <Pagination totalPages={AppContacts?.meta?.totalPages || 0} />
        </div>
      </div>
    </div>
  );
}
