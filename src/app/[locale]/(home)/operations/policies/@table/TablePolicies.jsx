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
import { PaginationV2 } from "@/src/components/pagination/PaginationV2";
import Link from "next/link";
import { deleteContactId } from "@/src/lib/apis";
import { handleApiError } from "@/src/utils/api/errors";
import { toast } from "react-toastify";
import { usePoliciesTable } from "../../../../../../hooks/useCommon";
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
  ListboxOptions,
} from "@headlessui/react";
import { formatDate } from "@/src/utils/getFormatDate";
import usePolicyContext from "../../../../../../context/policies";
import { itemsByPage } from "@/src/lib/common";
import { useRouter } from "next/navigation";
import { formatToCurrency } from "@/src/utils/formatters";
import useAppContext from "@/src/context/app";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TablePolicies() {
  const { data, limit, setLimit, setOrderBy, order, orderBy, page, setPage } =
    usePolicyContext();
  const { lists } = useAppContext();
  const { t } = useTranslation();
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const router = useRouter();
  const { setLastContactsUpdate, selectedContacts, setSelectedContacts } =
    useCrmContext();
  const { columnTable } = usePoliciesTable();
  const [selectedColumns, setSelectedColumns] = useState(
    columnTable.filter((c) => c.check)
  );
  const { onCloseAlertDialog } = useAlertContext();
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    if (checkbox.current) {
      const isIndeterminate =
        selectedContacts &&
        selectedContacts.length > 0 &&
        selectedContacts.length < data?.items.length;
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

  const itemOptions = [
    {
      name: "Ver",
      handleClick: (id) =>
        router.push(`/operations/policies/policy/${id}?show=true`),
    },
    // { name: "Editar" },
    // { name: "Copiar" },
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
                        className={`min-w-[12rem] py-2 pr-3 text-sm font-medium text-gray-400 cursor-pointer ${
                          index === selectedColumns.length - 1 && "rounded-e-xl"
                        }`}
                        onClick={() => {
                          column.order && setOrderBy(column.order);
                        }}
                      >
                        <div className="flex justify-center items-center gap-2">
                          {column.name}
                          <div>
                            {column.order && (
                              <ChevronDownIcon
                                className={clsx("h-6 w-6", {
                                  "text-primary": orderBy === column.order,
                                  "transform rotate-180":
                                    orderBy === column.order && order === "ASC",
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
                {data?.items && data?.items.length === 0 && (
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
                        {t("operations:policies:table:not-data")}
                      </p>
                    </div>
                  </div>
                )}
                {selectedColumns.length > 0 &&
                  data?.items &&
                  data?.items.map((policy, index) => {
                    return (
                      <tr
                        key={index}
                        className={clsx(
                          selectedContacts.includes(policy)
                            ? "bg-gray-200"
                            : undefined,
                          "hover:bg-indigo-100/40 cursor-default"
                        )}
                      >
                        <td className="pr-7 pl-4 sm:w-12">
                          {selectedContacts.includes(policy) && (
                            <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                          )}
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              value={policy.id}
                              checked={selectedContacts.includes(policy)}
                              onChange={(e) =>
                                setSelectedContacts(
                                  e.target.checked
                                    ? [...selectedContacts, policy]
                                    : selectedContacts.filter(
                                        (p) => p !== policy
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
                                    <MenuItem
                                      key={item.name}
                                      onClick={() =>
                                        item.handleClick &&
                                        item.handleClick(policy.id)
                                      }
                                    >
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
                            <td className="ml-4 py-4" key={index}>
                              <div className="font-medium text-sm text-center text-black hover:text-primary">
                                {column.row == "name" ? (
                                  <Link
                                    href={`/operations/policies/policy/${policy.id}?show=true`}
                                  >
                                    {/* <div className="flex gap-3 items-center"> */}
                                    {/* <Image
                                        className="h-8 w-8 rounded-full bg-zinc-200"
                                        width={30}
                                        height={30}
                                        src={
                                          policy?.responsible?.avatar ||
                                          "/img/avatar.svg"
                                        }
                                        alt=""
                                      /> */}
                                    <div className="flex flex-col">
                                      <p className="text-start">
                                        {policy?.name}
                                      </p>
                                      {policy?.responsible?.bio && (
                                        <p className="text-start text-xs">
                                          {policy?.responsible?.bio}
                                        </p>
                                      )}
                                    </div>
                                    {/* </div> */}
                                  </Link>
                                ) : column.row == "activities" ? (
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
                                ) : column.row === "fechaEmision" ? (
                                  formatDate(
                                    policy[column.row],
                                    "dd/MM/yyyy"
                                  ) ?? null
                                ) : column.row === "importePagar" ? (
                                  `${lists?.policies?.currencies?.find((x) => x.id == policy?.currency?.id)?.symbol ?? ""} ${formatToCurrency(policy[column.row])}`
                                ) : (
                                  policy[column.row] || "-"
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
        <div className="flex justify-center">
          <div className="flex gap-1 items-center">
            <p>Mostrar:</p>
            <Listbox value={limit} onChange={setLimit} as="div">
              <ListboxButton
                className={clsx(
                  "relative block w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2"
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
          <PaginationV2
            totalPages={data?.meta?.totalPages || 0}
            currentPage={page}
            setPage={setPage}
          />
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
