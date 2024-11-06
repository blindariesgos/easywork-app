"use client";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import React, {
  useState,
  Fragment,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useTranslation } from "react-i18next";
import { FaWhatsapp } from "react-icons/fa6";
import {
  ChatBubbleBottomCenterIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/20/solid";
import useControlContext from "@/src/context/control";
import FooterTable from "@/src/components/FooterTable";
import AddColumnsTable from "@/src/components/AddColumnsTable";
import SelectedOptionsTable from "@/src/components/SelectedOptionsTable";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Bars3Icon, ChevronRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import useCrmContext from "@/src/context/crm";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import useAppContext from "@/src/context/app";
import { formatToCurrency } from "@/src/utils/formatters";
import moment from "moment";

export default function ControlTable({ name }) {
  const { t } = useTranslation();
  const { data, limit, setLimit, setOrderBy, order, orderBy, page, setPage } =
    useControlContext();
  const { lists } = useAppContext();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const columns = [
    {
      name: t("control:portafolio:control:table:receipt"),
      row: "title",
      order: "receipt",
      check: true,
      permanent: true,
    },
    {
      name: t("control:portafolio:control:table:contact"),
      row: "client",
      order: "client",
      check: true,
    },
    {
      name: t("control:portafolio:control:table:amount"),
      row: "paymentAmount",
      check: true,
    },
    // {
    //   name: t("control:portafolio:control:table:currency"),
    //   row: "currency",
    //   check: true,
    // },
    {
      name: t("control:portafolio:control:table:expired"),
      row: "dueDate",
      order: "dueDate",
      check: true,
    },
    {
      name: t("control:portafolio:control:table:actions"),
      row: "activities",
      check: true,
    },
  ];
  const [selectedColumns, setSelectedColumns] = useState(columns);
  const {
    selectedContacts: selectedReceipts,
    setSelectedContacts: setSelectedReceipts,
  } = useCrmContext();

  useLayoutEffect(() => {
    if (checkbox.current) {
      const isIndeterminate =
        selectedReceipts &&
        selectedReceipts.length > 0 &&
        selectedReceipts.length < data?.meta?.totalItems;
      setChecked(selectedReceipts?.length === data?.meta?.totalItems);
      setIndeterminate(isIndeterminate);
      checkbox.current.indeterminate = isIndeterminate;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReceipts]);

  const toggleAll = useCallback(() => {
    setSelectedReceipts(checked || indeterminate ? [] : data?.items);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }, [checked, indeterminate, data, setSelectedReceipts]);

  const handleShowReceipt = (id) => {
    const params = new URLSearchParams(searchParams);
    params.set("show", true);
    params.set("receipt", id);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const itemOptions = [
    {
      name: "Ver",
      handleClick: (id) => handleShowReceipt(id),
    },
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
          name: "Envío masivo SMS",
          disabled: true,
        },
        {
          name: "Correo electrónico",
          disabled: true,
        },
      ],
    },
    // { name: "Editar" },
    // { name: "Copiar" },
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
                              className=" h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              ref={checkbox}
                              checked={checked}
                              onChange={toggleAll}
                            />
                            <AddColumnsTable
                              columns={columns}
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
                                index === selectedColumns.length - 1 &&
                                "rounded-e-xl"
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
                                        "text-primary":
                                          orderBy === column.order,
                                        "transform rotate-180":
                                          orderBy === column.order &&
                                          order === "ASC",
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
                        data?.items.map((receipt, index) => {
                          return (
                            <tr
                              key={index}
                              className={clsx(
                                selectedReceipts.includes(receipt.id)
                                  ? "bg-gray-200"
                                  : undefined,
                                "hover:bg-indigo-100/40 cursor-default relative"
                              )}
                            >
                              <td className="pr-7 pl-4 sm:w-12">
                                {selectedReceipts.includes(receipt.id) && (
                                  <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                                )}
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    value={receipt.id}
                                    checked={selectedReceipts.includes(
                                      receipt.id
                                    )}
                                    onChange={(e) =>
                                      setSelectedReceipts(
                                        e.target.checked
                                          ? [...selectedReceipts, receipt.id]
                                          : selectedReceipts.filter(
                                              (p) => p !== receipt.id
                                            )
                                      )
                                    }
                                  />

                                  <Menu
                                    as="div"
                                    className="relative hover:bg-slate-50/30 w-10 md:w-auto py-2 rounded-lg"
                                  >
                                    <MenuButton className=" flex items-center ">
                                      <Bars3Icon
                                        className=" h-5 w-5 text-gray-400"
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
                                        className=" z-50 mt-2.5  rounded-md bg-white py-2 shadow-lg focus:outline-none"
                                      >
                                        {itemOptions.map((item) =>
                                          !item.options ? (
                                            <MenuItem
                                              key={item.name}
                                              disabled={item.disabled}
                                              onClick={() => {
                                                item.handleClick &&
                                                  item.handleClick(receipt.id);
                                              }}
                                            >
                                              <div
                                                className={
                                                  "block data-[focus]:bg-gray-50 px-3 data-[disabled]:opacity-50 py-1 text-sm leading-6 text-black cursor-pointer"
                                                }
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
                                                  {item.options.map(
                                                    (option) => (
                                                      <MenuItem
                                                        key={option.name}
                                                        disabled={
                                                          option.disabled
                                                        }
                                                        onClick={() => {
                                                          option.handleClick &&
                                                            option.handleClick(
                                                              receipt.id
                                                            );
                                                        }}
                                                      >
                                                        <div
                                                          className={clsx(
                                                            "block px-3 py-1 text-sm leading-6 text-black cursor-pointer data-[focus]:bg-gray-50 data-[disabled]:opacity-50"
                                                          )}
                                                        >
                                                          {option.name}
                                                        </div>
                                                      </MenuItem>
                                                    )
                                                  )}
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
                                    <div className="font-medium text-sm text-black hover:text-primary">
                                      {column.row == "responsible" ? (
                                        <div className="flex gap-3 items-center">
                                          <Image
                                            className="h-8 w-8 rounded-full bg-zinc-200"
                                            width={30}
                                            height={30}
                                            src={
                                              receipt?.responsible?.avatar ||
                                              "/img/avatar.svg"
                                            }
                                            alt=""
                                          />
                                          <div className="flex flex-col">
                                            <p className="text-start">
                                              {receipt?.responsible?.profile
                                                ? `${receipt?.responsible?.profile?.firstName} ${receipt?.responsible?.profile?.lastName}`
                                                : receipt?.responsible
                                                    ?.username}
                                            </p>
                                            {receipt?.responsible?.bio && (
                                              <p className="text-start text-xs">
                                                {receipt?.responsible?.bio}
                                              </p>
                                            )}
                                          </div>
                                        </div>
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
                                      ) : column.row === "title" ? (
                                        <p
                                          onClick={() =>
                                            handleShowReceipt(receipt.id)
                                          }
                                          className="cursor-pointer"
                                        >
                                          {receipt[column.row]}
                                        </p>
                                      ) : column.row === "client" ? (
                                        <Link
                                          href={`/sales/crm/contacts/contact/${receipt?.poliza?.contact?.id}?show=true`}
                                          className="pr-2"
                                        >
                                          {receipt?.poliza?.contact?.fullName ??
                                            receipt?.poliza?.contact?.name ??
                                            "S/N"}
                                        </Link>
                                      ) : column.row === "stages" ? (
                                        <div className="flex items-center flex-col">
                                          <div className="flex justify-center">
                                            {receiptStage(receipt?.stage)}
                                          </div>
                                          <p className="mt-1 text-xs text-[#969696] font-semibold">
                                            {receipt?.stage?.name ?? "S/N"}
                                          </p>
                                        </div>
                                      ) : column.row === "paymentAmount" ? (
                                        <p className="text-center">
                                          {`${lists?.policies?.currencies?.find((x) => x.id == receipt?.currency?.id)?.symbol ?? "MXN"} ${formatToCurrency(receipt?.paymentAmount)}`}
                                        </p>
                                      ) : column.row === "createdAt" ||
                                        column.row === "dueDate" ? (
                                        <p className="text-center">
                                          {moment(receipt[column.row])
                                            .utc()
                                            .format("DD/MM/yyyy") ?? null}
                                        </p>
                                      ) : column.row === "policy" ? (
                                        <Link
                                          href={`/operations/policies/policy/${receipt?.poliza?.id}?show=true`}
                                          className="text-center w-full"
                                        >
                                          <p className="text-center">
                                            {receipt?.poliza?.poliza || "-"}
                                          </p>
                                        </Link>
                                      ) : column.row === "status" ? (
                                        <p className="text-center capitalize">
                                          {receipt?.status || "-"}
                                        </p>
                                      ) : (
                                        <p className="text-center">
                                          {receipt[column.row] || "-"}
                                        </p>
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
            </div>
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
