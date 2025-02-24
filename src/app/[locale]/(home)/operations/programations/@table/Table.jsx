"use client";
import {
  ChatBubbleBottomCenterIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  PhoneIcon,
  Bars3Icon,
} from "@heroicons/react/20/solid";
import { FaWhatsapp } from "react-icons/fa6";
import clsx from "clsx";
import React, {
  useLayoutEffect,
  useRef,
  useState,
  Fragment,
  useCallback,
} from "react";
import useCrmContext from "@/src/context/crm";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { deleteScheduleById, putPoliza, putSchedule } from "@/src/lib/apis";
import { handleApiError } from "@/src/utils/api/errors";
import { toast } from "react-toastify";
import { useProgramationTable } from "../../../../../../hooks/useCommon";
import AddColumnsTable from "@/src/components/AddColumnsTable";
import SelectedOptionsTable from "@/src/components/SelectedOptionsTable";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import useProgramationContext from "@/src/context/programations";
import { useRouter } from "next/navigation";
import useAppContext from "@/src/context/app";
import FooterTable from "@/src/components/FooterTable";
import DeleteItemModal from "@/src/components/modals/DeleteItem";
import moment from "moment";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  polizaReimbursementStatus,
  polizaReimbursementStatusColor,
} from "@/src/utils/constants";
import TableHeader from "@/src/components/Table";

export default function Table() {
  const {
    data,
    limit,
    setLimit,
    setOrderBy,
    order,
    orderBy,
    page,
    setPage,
    mutate,
  } = useProgramationContext();
  const { lists } = useAppContext();
  const { t } = useTranslation();
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const router = useRouter();
  const { selectedContacts, setSelectedContacts } = useCrmContext();
  const { columnTable } = useProgramationTable();
  const [selectedColumns, setSelectedColumns] = useState(
    columnTable.filter((c) => c.check)
  );
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [isOpenDeleteMasive, setIsOpenDeleteMasive] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  useLayoutEffect(() => {
    if (checkbox.current) {
      const isIndeterminate =
        selectedContacts &&
        selectedContacts?.length > 0 &&
        selectedContacts?.length < data?.items?.length;
      setChecked(selectedContacts?.length === data?.items?.length);
      setIndeterminate(isIndeterminate);
      checkbox.current.indeterminate = isIndeterminate;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContacts, data]);

  const toggleAll = useCallback(() => {
    setSelectedContacts(
      checked || indeterminate ? [] : data?.items?.map((x) => x.id)
    );
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }, [checked, indeterminate, data, setSelectedContacts]);

  const deleteSchedule = async (id) => {
    try {
      setLoading(true);
      const response = await deleteScheduleById(id);
      if (response.hasError) {
        let message = response.message;
        if (Array.isArray(response.message)) {
          message = response.message.join(", ");
        }
        toast.error(message);
        setLoading(false);
        return;
      }
      toast.success(t("common:alert:delete-success"));
      mutate();
      setLoading(false);
      setIsOpenDelete(false);
    } catch (err) {
      setLoading(false);
      handleApiError(err.message);
    }
  };

  const deleteSchedules = async () => {
    setLoading(true);
    const response = await Promise.allSettled(
      selectedContacts.map((scheduleId) => deleteScheduleById(scheduleId))
    );
    if (response.some((x) => x.status === "fulfilled")) {
      toast.success(
        `Se elimino con éxito ${response.filter((x) => x.status == "fulfilled").length} elemento(s) de ${selectedContacts.length} seleccionado(s)`
      );
    }

    if (response.some((x) => x.status === "rejected")) {
      toast.error(
        `Ocurrio un error al tratar de eliminar ${response.filter((x) => x.status == "rejected").length} elementos(s)`
      );
    }

    setSelectedContacts([]);
    mutate();
    setLoading(false);
    setIsOpenDeleteMasive(false);
  };

  const changeStatusSchedules = async (status) => {
    setLoading(true);
    const body = {
      status: status.id,
    };
    const response = await Promise.allSettled(
      selectedContacts.map((scheduleId) => putSchedule(scheduleId, body))
    );
    if (response.some((x) => x.status === "fulfilled" && !x?.value?.hasError)) {
      toast.success(
        t("common:alert:update-items-succes", {
          count: response.filter(
            (x) => x.status == "fulfilled" && !x?.value?.hasError
          ).length,
          total: selectedContacts.length,
        })
      );
    }

    if (response.some((x) => x.status === "rejected" || x?.value?.hasError)) {
      toast.error(
        t("common:alert:update-items-error", {
          count: response.filter(
            (x) => x.status == "rejected" || x?.value?.hasError
          ).length,
        })
      );
    }

    setSelectedContacts([]);
    mutate();
    setLoading(false);
  };

  const changeResponsible = async (responsible) => {
    const body = {
      assignedById: responsible.id,
    };
    const response = await Promise.allSettled(
      selectedContacts.map((policyId) => putPoliza(policyId, body))
    );

    if (response.some((x) => x.status === "fulfilled" && !x?.value?.hasError)) {
      toast.success(
        t("common:alert:update-items-succes", {
          count: response.filter(
            (x) => x.status == "fulfilled" && !x?.value?.hasError
          ).length,
          total: selectedContacts.length,
        })
      );
    }

    if (response.some((x) => x.status === "rejected" || x?.value?.hasError)) {
      toast.error(
        t("common:alert:update-items-error", {
          count: response.filter(
            (x) => x.status == "rejected" || x?.value?.hasError
          ).length,
        })
      );
    }

    setSelectedContacts([]);
    mutate();
    setLoading(false);
  };

  const masiveActions = [
    {
      id: 3,
      name: "Cambiar Responsable",
      onclick: changeResponsible,
      selectUser: true,
      disabled: true,
    },
    {
      id: 2,
      name: t("common:table:checkbox:change-status"),
      onclick: changeStatusSchedules,
      selectOptions: Object.keys(polizaReimbursementStatus).map((key) => ({
        id: key,
        name: polizaReimbursementStatus[key],
      })),
    },
    {
      id: 1,
      name: "Crear tarea",
      disabled: true,
    },
    {
      id: 1,
      name: t("common:buttons:delete"),
      onclick: () => setIsOpenDeleteMasive(true),
    },
  ];

  const itemActions = [
    {
      name: "Ver",
      handleClick: (id) =>
        router.push(`/operations/programations/programation/${id}?show=true`),
    },
    {
      name: "Editar",
      handleClick: (id) =>
        router.push(
          `/operations/programations/programation/${id}?show=true&edit=true`
        ),
    },
    {
      name: "Eliminar",
      handleClick: (id) => {
        setDeleteId(id);
        setIsOpenDelete(true);
      },
    },
    {
      name: "Planificar",
      options: [
        {
          name: "Tarea",
          handleClick: (id) =>
            router.push(
              `/tools/tasks/task?show=true&prev=poliza_scheduling&prev_id=${id}`
            ),
        },
        {
          name: "Cita",
          handleClick: (id) =>
            router.push(
              `/tools/calendar/addEvent?show=true&prev=poliza_scheduling&prev_id=${id}`
            ),
        },
        {
          name: "Comentario",
          disabled: true,
        },
        {
          name: "Correo",
          disabled: true,
        },
      ],
    },
  ];

  const renderStage = (status) => {
    const color =
      polizaReimbursementStatusColor?.[status] ??
      polizaReimbursementStatusColor?.captura_documentos;

    const stageIndex = status
      ? Object.keys(polizaReimbursementStatus).findIndex((x) => x == status)
      : 0;

    return (
      <div className="flex flex-col gap-1 items-center">
        <div className={`flex justify-center bg-gray-200`}>
          {Object.keys(polizaReimbursementStatus).map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 border-t border-b border-l last:border-r border-gray-400`}
              style={{ background: index <= stageIndex ? color : "" }}
            />
          ))}
        </div>
        <p className="text-sm text-center">
          {polizaReimbursementStatus?.[status] ??
            polizaReimbursementStatus?.captura_documentos}
        </p>
      </div>
    );
  };

  return (
    <Fragment>
      {loading && <LoaderSpinner />}
      {selectedContacts.length > 0 && (
        <div className="flex py-2">
          <SelectedOptionsTable options={masiveActions} />
        </div>
      )}
      <TableHeader
        selectedRows={selectedContacts}
        setSelectedRows={setSelectedContacts}
        data={data}
        order={order}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
        columnTable={columnTable}
      >
        {selectedColumns.length > 0 &&
          data?.items &&
          data?.items.map((programation, index) => {
            return (
              <tr
                key={index}
                className={clsx(
                  selectedContacts.includes(programation.id)
                    ? "bg-gray-200"
                    : undefined,
                  "hover:bg-indigo-100/40 cursor-default"
                )}
              >
                <td className="pr-7 pl-4 sm:w-12 relative">
                  {selectedContacts.includes(programation.id) && (
                    <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                  )}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      value={programation.id}
                      checked={selectedContacts.includes(programation.id)}
                      onChange={(e) =>
                        setSelectedContacts(
                          e.target.checked
                            ? [...selectedContacts, programation.id]
                            : selectedContacts.filter(
                                (p) => p !== programation.id
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
                        <MenuItems
                          anchor="right start"
                          className=" z-50 mt-2.5  rounded-md bg-white py-2 shadow-lg focus:outline-none"
                        >
                          {itemActions.map((item) =>
                            !item.options ? (
                              <MenuItem
                                key={item.name}
                                disabled={item.disabled}
                                onClick={() => {
                                  item.handleClick &&
                                    item.handleClick(programation.id);
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
                                    <ChevronRightIcon className="h-4 w-4" />
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
                                            option.handleClick(programation.id);
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
                      <div
                        className={clsx(
                          "font-medium text-sm  text-black hover:text-primary"
                        )}
                      >
                        {column.row == "name" ? (
                          <Link
                            href={`/operations/programations/programation/${programation.id}?show=true`}
                          >
                            <p>{`${
                              programation?.insurance?.name ?? ""
                            } ${programation?.poliza?.poliza} ${programation?.polizaType?.name}`}</p>
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
                        ) : column.row === "poliza" ? (
                          <Link
                            href={`/operations/policies/policy/${programation?.poliza?.id}?show=true`}
                          >
                            <p className="text-center">
                              {programation?.poliza?.poliza}
                            </p>
                          </Link>
                        ) : column.row == "client" ? (
                          programation?.contact?.id ? (
                            <Link
                              href={`/sales/crm/contacts/contact/${programation?.contact?.id}?show=true`}
                            >
                              <p className="text-center">
                                {programation?.contact?.fullName}
                              </p>
                            </Link>
                          ) : (
                            <p className="text-center">No asignado</p>
                          )
                        ) : column.row === "createdAt" ? (
                          <p className="text-center">
                            {moment(programation?.createdAt).format(
                              "DD/MM/YYYY"
                            )}
                          </p>
                        ) : column.row === "status" ? (
                          renderStage(programation?.status)
                        ) : (
                          programation[column.row] || "-"
                        )}
                      </div>
                    </td>
                  ))}
              </tr>
            );
          })}
      </TableHeader>
      <div className="w-full pt-4 ">
        <FooterTable
          limit={limit}
          setLimit={setLimit}
          page={page}
          setPage={setPage}
          totalPages={data?.meta?.totalPages}
          total={data?.meta?.totalItems ?? 0}
        />
      </div>
      <DeleteItemModal
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        handleClick={() => deleteSchedule(deleteId)}
        loading={loading}
      />
      <DeleteItemModal
        isOpen={isOpenDeleteMasive}
        setIsOpen={setIsOpenDeleteMasive}
        handleClick={() => deleteSchedules()}
        loading={loading}
      />
    </Fragment>
  );
}
