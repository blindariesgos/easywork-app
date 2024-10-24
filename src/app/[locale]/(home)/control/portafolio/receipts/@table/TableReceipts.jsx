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
import { useTranslation } from "react-i18next";
import { PaginationV2 } from "@/src/components/pagination/PaginationV2";
import Link from "next/link";
import { deleteContactId, deleteReceiptById } from "@/src/lib/apis";
import { handleApiError } from "@/src/utils/api/errors";
import { toast } from "react-toastify";
import { useReceiptTable } from "../../../../../../../hooks/useCommon";
import AddColumnsTable from "@/src/components/AddColumnsTable";
import SelectedOptionsTable from "@/src/components/SelectedOptionsTable";
import { useAlertContext } from "@/src/context/common/AlertContext";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { formatToCurrency } from "@/src/utils/formatters";

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
import useReceiptContext from "../../../../../../../context/receipts";
import { itemsByPage } from "@/src/lib/common";
import { useRouter } from "next/navigation";
import useCrmContext from "@/src/context/crm";
import useAppContext from "@/src/context/app";
import FooterTable from "@/src/components/FooterTable";
import moment from "moment";

export default function TableReceipts() {
  const { data, limit, setLimit, setOrderBy, order, orderBy, page, setPage } =
    useReceiptContext();
  const { lists } = useAppContext();
  const { t } = useTranslation();
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const router = useRouter();
  const {
    selectedContacts: selectedReceipts,
    setSelectedContacts: setSelectedReceipts,
  } = useCrmContext();
  const { columnTable } = useReceiptTable();
  const [selectedColumns, setSelectedColumns] = useState(
    columnTable.filter((c) => c.check)
  );
  const { onCloseAlertDialog } = useAlertContext();
  const [loading, setLoading] = useState(false);

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

  const deleteReceipts = async (receipts) => {
    const response = await Promise.allSettled(
      receipts.map((receiptId) => deleteReceiptById(receiptId))
    );
    if (response.some((x) => x.status === "fulfilled")) {
      toast.success(
        `Se eliminaron ${response.filter((x) => x.status === "fulfilled").length} recibos de ${receipts.length} seleccionados`
      );
      setSelectedReceipts([]);
    } else {
      toast.error("Ocurrio un error al eliminar los recibos");
    }
    onCloseAlertDialog();
  };

  const masiveActions = [
    // {
    //   id: 1,
    //   name: t("common:buttons:delete"),
    //   onclick: () => deleteReceipts(selectedReceipts),
    // },
    {
      id: 2,
      name: "Crear tarea",
      // onclick: () => deleteReceipts(selectedReceipts),
      disabled: true,
    },
    {
      id: 3,
      name: "Agregar Observador",
      // onclick: () => deleteReceipts(selectedReceipts),
      disabled: true,
    },
  ];

  const itemOptions = [
    {
      name: "Ver",
      handleClick: (id) =>
        router.push(`/control/portafolio/receipts/receipt/${id}?show=true`),
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
          disabled: true,
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

  const receiptStage = (receiptStage) => {
    const colors = [
      "bg-[#A9EA44]",
      "bg-[#86BEDF]",
      "bg-[#EAB544]",
      "bg-[#EA8644]",
      "bg-[#EA4444]",
    ];
    const stageIndex =
      lists?.receipts?.receiptStages
        ?.map((stage) => stage.id)
        ?.findIndex((value) => receiptStage?.id == value) ?? -1;

    const getColorClass = (item, currentIndex, stageInd) => {
      if (item?.status == "pagado") return "bg-[#A9EA44]";
      if (stageInd >= 5) return "bg-[#EA4444]";
      if (item && stageInd < 5 && currentIndex <= stageInd)
        return colors[stageIndex];
      return "";
    };

    return (
      <div className={`flex justify-center  ${"bg-gray-200"}`}>
        {new Array(5).fill(1).map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 ${getColorClass(receiptStage, index, stageIndex)} border-t border-b border-l last:border-r border-gray-400`}
          />
        ))}
      </div>
    );
  };

  if (data?.items && data?.items.length === 0) {
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
          <p className="text-lg font-medium text-gray-400">No hay Recibos</p>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      {loading && <LoaderSpinner />}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="relative sm:rounded-lg h-[60vh]">
            <table className="min-w-full rounded-md bg-gray-100 table-auto relative">
              <thead className="text-sm bg-white drop-shadow-sm sticky top-0 z-10">
                <tr>
                  <th
                    scope="col"
                    className="relative pl-4 pr-7 sm:w-12 rounded-s-xl py-5 flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      className=" h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
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
                          <div className="flex items-center gap-x-1">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              value={receipt.id}
                              checked={selectedReceipts.includes(receipt.id)}
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
                              className="relative hover:bg-slate-50/30 w-10 md:w-auto py-2 px-1 rounded-lg"
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
                                            {item.options.map((option) => (
                                              <MenuItem
                                                key={option.name}
                                                disabled={option.disabled}
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
                                          : receipt?.responsible?.username}
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
                                  <Link
                                    href={`/control/portafolio/receipts/receipt/${receipt.id}?show=true`}
                                  >
                                    {receipt[column.row]}
                                  </Link>
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
        <div className="flex flex-col justify-start gap-2 items-start">
          {selectedReceipts.length > 0 && (
            <Fragment>
              <p>{`Elementos seleccionados: ${selectedReceipts.length} / ${data?.meta?.totalItems}`}</p>
              <SelectedOptionsTable options={masiveActions} />
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
}
