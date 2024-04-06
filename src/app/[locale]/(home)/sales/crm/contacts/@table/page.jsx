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
import React, { useLayoutEffect, useRef, useState } from "react";
import useCrmContext from "@/context/crm";
import { getURLContactPhoto } from "@/lib/common";
import useAppContext from "@/context/app";
import { useTranslation } from "react-i18next";
import { Pagination } from "@/components/pagination/Pagination";
import Link from "next/link"

export default function Page() {
  const { t } = useTranslation();
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const { setShowContact } = useAppContext();
  const { contacts: AppContacts, setCurrentContactID } = useCrmContext();
  const [pagActual, setPageActual] = useState(0);

  useLayoutEffect(() => {
    if (checkbox.current) {
      const isIndeterminate =
        selectedContacts && selectedContacts.length > 0 &&
        selectedContacts.length < AppContacts.length;
      setChecked(selectedContacts?.length === AppContacts?.length);
      setIndeterminate(isIndeterminate);
      checkbox.current.indeterminate = isIndeterminate;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContacts]);

  function toggleAll() {
    setSelectedContacts(checked || indeterminate ? [] : AppContacts);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  if (AppContacts && AppContacts.length === 0) {
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
          <p className="text-lg font-medium text-gray-400">{t('contacts:table:not-data')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flow-root relative h-[70vh]">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="relative overflow-hidden  sm:rounded-lg">
            {selectedContacts && selectedContacts.length > 0 && (
              <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white sm:left-12">
                <button
                  type="button"
                  className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-medium text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                >
                  {t('common:buttons:edit')}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-medium text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                >
                  {t('common:buttons:delete')}
                </button>
              </div>
            )}
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-white mb-2">
                <tr>
                  <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                    <input
                      type="checkbox"
                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      ref={checkbox}
                      checked={checked}
                      onChange={toggleAll}
                    />
                  </th>
                  <th
                    scope="col"
                    className="min-w-[12rem] py-3.5 pr-3 text-sm font-medium text-gray-400"
                  >
                    <div className="flex justify-center items-center gap-2">
                      {t('contacts:table:contact')}
                      <div>
                        <ChevronDownIcon className="h-6 w-6 text-primary"/>
                      </div>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-sm font-medium text-gray-400"
                  >
                    <div className="flex justify-center items-center gap-2">
                      {t('contacts:table:birthday')}
                      <div>
                        <ChevronDownIcon className="h-6 w-6 text-primary"/>
                      </div>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-sm font-medium text-gray-400"
                  >
                    <div className="flex justify-center items-center gap-2">
                      {t('contacts:table:responsible')}
                      <div>
                        <ChevronDownIcon className="h-6 w-6 text-primary"/>
                      </div>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-sm font-medium text-gray-400"
                  >
                    <div className="flex justify-center items-center gap-2">
                      {t('contacts:table:email')}
                      <div>
                        <ChevronDownIcon className="h-6 w-6 text-primary"/>
                      </div>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-sm font-medium text-gray-400"
                  >
                    <div className="flex justify-center items-center gap-2">
                      {t('contacts:table:phone')}
                      <div>
                        <ChevronDownIcon className="h-6 w-6 text-primary"/>
                      </div>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-sm font-medium text-gray-400"
                  >
                    <div className="flex justify-center items-center gap-2">
                      {t('contacts:table:created')}
                      <div>
                        <ChevronDownIcon className="h-6 w-6 text-primary"/>
                      </div>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-sm font-medium text-gray-400"
                  >
                    <div className="flex justify-center items-center gap-2">
                      {t('contacts:table:origin')}
                      <div>
                        <ChevronDownIcon className="h-6 w-6 text-primary"/>
                      </div>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-sm font-medium text-gray-400"
                  >
                    <div className="flex justify-center items-center">
                      {t('contacts:table:activities')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {AppContacts && AppContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className={clsx(
                      selectedContacts.includes(contact)
                        ? "bg-gray-50"
                        : undefined,
                      "hover:bg-indigo-100/40 cursor-default"
                    )}
                  >
                    <td className="relative px-7 sm:w-12 sm:px-6">
                      {selectedContacts.includes(contact) && (
                        <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                      )}
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:text-primary"
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
                    <td
                      className={clsx(
                        "whitespace-nowrap py-4 pr-3 text-sm font-medium",
                        selectedContacts.includes(contact)
                          ? "text-indigo-600"
                          : "text-gray-400"
                      )}
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0">
                          <Image
                            className="h-8 w-8 rounded-full bg-zinc-200"
                            width={30}
                            height={30}
                            src={
                              getURLContactPhoto(contact) ?? "/img/avatar.svg"
                            }
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-sm text-black hover:text-indigo-600">
                            {/* <button
                              onClick={() => {
                                setCurrentContactID(contact.id);
                                console.log(contact.id);
                                setShowContact(true);
                              }}
                            > */}
                            <Link href={`/sales/crm/contacts/contact/${contact.id}`}>{contact.nombre} {contact.apellidos}</Link>
                              
                            {/* </button> */}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-black">
                      {contact.birthday ?? "05/02/1991"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-black">
                      {contact?.responsibleUser?.name ?? "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-black">
                      {contact.email}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-black">
                      {contact.telefono}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-black">
                      {new Date(contact.createdAt).toLocaleDateString() ??
                        "05/02/1991"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-black">
                      {contact.source}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-black">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="rounded-full bg-green-100 p-1 text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="rounded-full bg-primary p-1 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          <EnvelopeIcon
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        </button>
                        <button
                          type="button"
                          className="rounded-full bg-primary p-1 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          <ChatBubbleBottomCenterIcon
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        </button>
                        <button
                          type="button"
                          className="rounded-full bg-primary p-1 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          <PhoneIcon className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0">
        <Pagination
          takeCount={5}
          total={50}
          pagActual={pagActual}
          setPagActual={setPageActual}
        />
      </div>
    </div>
  );
}
