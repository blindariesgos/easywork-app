"use client";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import React, { useState, Fragment } from "react";
import { PaginationV2 } from "@/src/components/pagination/PaginationV2";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useTranslation } from "react-i18next";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { itemsByPage } from "@/src/lib/common";
import { FaWhatsapp } from "react-icons/fa6";
import {
  ChatBubbleBottomCenterIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/20/solid";
import TextInput from "@/src/components/form/TextInput";

export default function ControlTable({ name }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      name: t("control:portafolio:control:table:contact"),
      field: "b",
    },
    {
      name: t("control:portafolio:control:table:policy"),
      field: "f",
    },
    {
      name: t("control:portafolio:control:table:receipt"),
      field: "a",
    },
    {
      name: t("control:portafolio:control:table:insurance"),
      field: "m",
    },
    {
      name: t("control:portafolio:control:table:amount"),
      field: "g",
    },
    {
      name: t("control:portafolio:control:table:currency"),
      field: "h",
    },
    {
      name: t("control:portafolio:control:table:expired"),
      field: "j",
    },
    {
      name: t("control:portafolio:control:table:actions"),
      field: "activities",
    },
  ];

  return (
    <Fragment>
      <div className="flow-root">
        {loading && <LoaderSpinner />}
        <div className="min-w-full py-2">
          <div className="sm:rounded-lg ">
            <div className="flex justify-between flex-col md:flex-row">
              <h2 className="text-xl font-bold text-primary hidden md:block">
                {name}
              </h2>
            </div>
            <div className="overflow-x-auto min-h-[60vh] h-full">
              <table className="min-w-full rounded-md bg-gray-100 table-auto  ">
                <thead className="text-sm bg-white drop-shadow-sm">
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        scope="col"
                        className={`min-w-[12rem] py-3.5 pr-3 text-sm font-medium text-primary cursor-pointer `}
                      >
                        <div className="flex justify-center items-center gap-2">
                          {column.name}
                          <div>
                            <ChevronDownIcon
                              className={`h-6 w-6 text-primary`}
                            />
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="">
                  {[].map((control, index) => (
                    <tr
                      key={index}
                      className={clsx(
                        "hover:bg-indigo-100/40 cursor-default odd:bg-[#F2F6F7] even:bg-white"
                      )}
                    >
                      {columns.map((column, index) => (
                        <td className="text-center py-5 pr-2" key={index}>
                          <div className="font-medium text-sm text-nowrap text-black hover:text-primary capitalize">
                            {renderCellContent(column, control, t)}
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
        <div className="w-full mt-2">
          <div className="flex justify-center">
            <div className="flex gap-1 items-center">
              <p>Mostrando:</p>
              <Listbox value={10} onChange={() => {}} as="div">
                <ListboxButton
                  className={clsx(
                    "relative block w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6",
                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2"
                  )}
                >
                  {10}
                  <ChevronDownIcon
                    className="group pointer-events-none absolute top-2.5 right-2.5 size-4 "
                    aria-hidden="true"
                  />
                </ListboxButton>
                <ListboxOptions
                  anchor="bottom"
                  transition
                  className={clsx(
                    "rounded-xl border border-white p-1 focus:outline-none bg-white shadow-2xl",
                    "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
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
            <PaginationV2 totalPages={1} currentPage={1} setPage={() => {}} />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export const renderCellContent = (column, control, t) => {
  const { field, link } = column;
  const controlValue = control[field];

  switch (field) {
    case "activities":
      return (
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
            <ChatBubbleBottomCenterIcon
              className="h-4 w-4"
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            className="rounded-full bg-primary p-1 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <PhoneIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      );

    default:
      return controlValue;
  }
};
