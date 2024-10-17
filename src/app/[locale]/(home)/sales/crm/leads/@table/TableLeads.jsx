"use client";
import {
  ChatBubbleBottomCenterIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/20/solid";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { FaWhatsapp } from "react-icons/fa6";
import clsx from "clsx";
import Image from "next/image";
import React, {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useOrderByColumn } from "../../../../../../../hooks/useOrderByColumn";
import AddColumnsTable from "../../../../../../../components/AddColumnsTable";
import { useLeadDetete, useLeads } from "../../../../../../../hooks/useCommon";
import SelectedOptionsTable from "../../../../../../../components/SelectedOptionsTable";
import moment from "moment";
import LoaderSpinner from "../../../../../../../components/LoaderSpinner";
import useLeadContext from "@/src/context/leads";
import FooterTable from "@/src/components/FooterTable";
import { Bars3Icon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import DeleteModal from "@/src/components/modals/DeleteItem";
import { deleteLeadById, updateLead } from "@/src/lib/apis";
import { handleApiError } from "@/src/utils/api/errors";
import { toast } from "react-toastify";
import useCrmContext from "@/src/context/crm";
import useAppContext from "@/src/context/app";

export default function TableLeads() {
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenDeleteMasive, setIsOpenDeleteMasive] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const { lists } = useAppContext();

  const {
    data,
    limit,
    setLimit,
    orderBy,
    setOrderBy,
    order,
    page,
    setPage,
    mutate,
  } = useLeadContext();
  const { t } = useTranslation();
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const { columnTable } = useLeads();
  const [selectedColumns, setSelectedColumns] = useState(
    columnTable.filter((c) => c.check)
  );
  const [dataLeads, setDataLeads] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    selectedContacts: selectedLeads,
    setSelectedContacts: setSelectedLeads,
  } = useCrmContext();

  useEffect(() => {
    if (data) setDataLeads(data);
  }, [data]);

  useLayoutEffect(() => {
    if (checkbox.current) {
      const isIndeterminate =
        selectedLeads &&
        selectedLeads.length > 0 &&
        selectedLeads.length < dataLeads?.items?.length;
      setChecked(selectedLeads.length === dataLeads?.items?.length);
      setIndeterminate(isIndeterminate);
      checkbox.current.indeterminate = isIndeterminate;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLeads, dataLeads]);

  function toggleAll() {
    setSelectedLeads(
      checked || indeterminate ? [] : dataLeads?.items?.map((x) => x.id)
    );
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  const ColorDivisionsStages = (data) => {
    const stageIndex =
      lists?.listLead?.leadStages
        ?.map((stage) => stage.id)
        ?.findIndex((value) => data?.id == value) ?? -1;

    const getColorClass = (item, currentIndex, stageInd) => {
      if (currentIndex <= stageInd && stageInd != -1) return "bg-yellow-500";
      if (item && stageInd == -1 && /Positivo/gi.test(item?.name))
        return "bg-green-primary";
      if (item && stageInd == -1 && !/Positivo/gi.test(item?.name))
        return "bg-red-500";

      return "";
    };
    console.log(
      new Array((lists?.listLead?.leadStages?.length ?? 5) + 1).fill(1)
    );
    return (
      <div className={`flex justify-center  ${"bg-gray-200"}`}>
        {new Array((lists?.listLead?.leadStages?.length ?? 5) + 1)
          .fill(1)
          .map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 ${getColorClass(data, index, stageIndex)} border-t border-b border-l last:border-r border-gray-400`}
            />
          ))}
      </div>
    );
  };

  const deleteLeads = async () => {
    setLoading(true);
    const response = await Promise.allSettled(
      selectedLeads.map((leadId) => deleteLeadById(leadId))
    );

    if (response.some((x) => x.status === "fulfilled")) {
      toast.success(
        `Se elimino con exito ${response.filter((x) => x.status == "fulfilled").length} pospecto(s) de ${selectedLeads.length} seleccionado(s)`
      );
    }

    if (response.some((x) => x.status === "rejected")) {
      toast.error(
        `Ocurrio un error al tratar de eliminar ${response.filter((x) => x.status == "rejected").length} prospecto(s)`
      );
    }

    setSelectedLeads([]);
    mutate();
    setLoading(false);
    setIsOpenDeleteMasive(false);
  };

  const changeResponsible = async (responsible) => {
    try {
      setLoading(true);
      const body = {
        assignedById: responsible.id,
      };

      await Promise.all(selectedLeads.map((id) => updateLead(body, id)));
      toast.success(t("contacts:table:update-contacts"));
      setSelectedLeads([]);
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
    {
      id: 9,
      name: "Enviar SMS masivo",
      disabled: true,
    },
  ];

  const deleteLead = async (id) => {
    try {
      setLoading(true);
      const response = await deleteLeadById(id);
      toast.success(t("contacts:delete:msg"));
      mutate();
      setLoading(false);
      setIsOpenDelete(false);
    } catch (err) {
      setLoading(false);
      handleApiError(err.message);
    }
  };

  const leadOptions = (lead) => [
    {
      name: "Ver",
      handleClick: (id) => router.push(`/sales/crm/leads/lead/${id}?show=true`),
    },
    {
      name: "Editar",
      handleClick: (id) =>
        router.push(`/sales/crm/leads/lead/${id}?show=true&edit=true`),
      disabled: lead?.cancelled || /Positivo/gi.test(lead?.stage?.name),
    },
    {
      name: "Copiar",
      handleClick: (id) =>
        router.push(`/sales/crm/leads/lead?show=true&copy=${id}`),
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
            router.push(`/tools/tasks/task?show=true&prev=leads&prev_id=${id}`),
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
    <div className="flow-root ">
      {loading && <LoaderSpinner />}
      <div className="flex pb-2">
        {selectedLeads.length > 0 && (
          <SelectedOptionsTable options={masiveOptions} />
        )}
      </div>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="relative sm:rounded-lg h-[60vh]">
            <table className="min-w-full rounded-md bg-gray-100 table-auto relative">
              <thead className="text-sm bg-white drop-shadow-sm sticky top-0 z-10">
                <tr>
                  <th
                    scope="col"
                    className="relative px-7 sm:w-12 sm:px-6 rounded-s-xl py-5 flex items-center gap-2"
                  >
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
                                  "transform rotate-180": order === "ASC",
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
                  data?.items?.length > 0 &&
                  data?.items?.map((lead, index) => (
                    <tr
                      key={index}
                      className={clsx(
                        selectedLeads.includes(lead.id)
                          ? "bg-gray-200"
                          : undefined,
                        "hover:bg-indigo-100/40 cursor-default"
                      )}
                    >
                      <td className=" px-7 sm:w-12 sm:px-6 relative">
                        {selectedLeads.includes(lead.id) && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                        )}
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            value={lead.id}
                            checked={selectedLeads.includes(lead.id)}
                            onChange={(e) =>
                              setSelectedLeads(
                                e.target.checked
                                  ? [...selectedLeads, lead.id]
                                  : selectedLeads.filter((p) => p !== lead.id)
                              )
                            }
                          />
                          <Menu
                            as="div"
                            className="relative hover:bg-slate-50/30 w-10 md:w-auto py-2 px-1 rounded-lg"
                          >
                            <MenuButton className="flex items-center p-1.5">
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
                                className=" z-50 mt-2.5 rounded-md bg-white py-2 shadow-lg focus:outline-none"
                              >
                                {leadOptions(lead).map((item) =>
                                  !item.options ? (
                                    <MenuItem
                                      key={item.name}
                                      disabled={item.disabled}
                                      onClick={() =>
                                        item.handleClick &&
                                        item.handleClick(lead.id)
                                      }
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
                                              onClick={() =>
                                                option.handleClick &&
                                                option.handleClick(lead.id)
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
                                  href={`/sales/crm/leads/lead/${lead.id}?show=true`}
                                  className="flex gap-3 items-center"
                                >
                                  <Image
                                    className="h-8 w-8 rounded-full bg-zinc-200"
                                    width={30}
                                    height={30}
                                    src={lead.photo ?? "/img/avatar.svg"}
                                    alt=""
                                  />
                                  <p className="text-left">
                                    {lead[column.row]}
                                  </p>
                                </Link>
                              ) : column.row === "stage" ? (
                                <div className="flex items-center flex-col">
                                  <div className="flex justify-center">
                                    {ColorDivisionsStages(lead?.stage)}
                                  </div>
                                  <p className="mt-1 text-xs text-[#969696] font-semibold">
                                    {lead.stage?.name}
                                  </p>
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
                              ) : column.row === "createdAt" ? (
                                moment(lead[column.row]).format("DD/MM/YYYY") ??
                                "N/A"
                              ) : column.row === "source" ? (
                                lead?.source?.name
                              ) : (
                                lead[column.row] || "-"
                              )}
                            </div>
                          </td>
                        ))}
                    </tr>
                  ))}
              </tbody>
            </table>
            {(!data || data?.items?.length === 0) && (
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
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-gray-400">
                    {t("leads:table:not-data")}
                  </p>
                </div>
              </div>
            )}
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

      {/* Delete ConfirmModal */}
      <DeleteModal
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        handleClick={() => deleteLead(deleteId)}
      />

      <DeleteModal
        isOpen={isOpenDeleteMasive}
        setIsOpen={setIsOpenDeleteMasive}
        handleClick={() => deleteLeads()}
      />
    </div>
  );
}
