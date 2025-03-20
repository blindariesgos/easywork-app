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
import React, { useState, Fragment } from "react";
import useCrmContext from "@/src/context/crm";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { deleteClaimById, putClaim } from "@/src/lib/apis";
import { handleApiError, handleFrontError } from "@/src/utils/api/errors";
import { toast } from "react-toastify";
import { useClaimTable } from "../../../../../../hooks/useCommon";
import SelectedOptionsTable from "@/src/components/SelectedOptionsTable";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import useClaimContext from "@/src/context/claims";
import { useRouter } from "next/navigation";
import useAppContext from "@/src/context/app";
import FooterTable from "@/src/components/FooterTable";
import DeleteItemModal from "@/src/components/modals/DeleteItem";
import TableHeader from "@/src/components/Table";
import {
  polizaClaimStatus,
  polizaClaimStatusColor,
} from "@/src/utils/constants";
import moment from "moment";

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
  } = useClaimContext();
  const { t } = useTranslation();
  const router = useRouter();
  const { selectedContacts, setSelectedContacts } = useCrmContext();
  const { columnTable } = useClaimTable();
  const [selectedColumns, setSelectedColumns] = useState(
    columnTable.filter((c) => c.check)
  );
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [isOpenDeleteMasive, setIsOpenDeleteMasive] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const deleteClaim = async (id) => {
    try {
      setLoading(true);
      const response = await deleteClaimById(id);
      if (response.hasError) {
        handleFrontError(response);
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

  const deleteClaims = async () => {
    setLoading(true);
    const response = await Promise.allSettled(
      selectedContacts.map((claimId) => deleteClaimById(claimId))
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

  const changeStatusClaims = async (status) => {
    setLoading(true);
    const body = {
      status: status.id,
    };
    const response = await Promise.allSettled(
      selectedContacts.map((claimId) => putClaim(claimId, body))
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
      selectedContacts.map((policyId) => putClaim(policyId, body))
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
    },
    {
      id: 2,
      name: t("common:table:checkbox:change-status"),
      onclick: changeStatusClaims,
      selectOptions: Object.keys(polizaClaimStatus).map((key) => ({
        id: key,
        name: polizaClaimStatus[key],
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
        router.push(`/operations/claims/claim/${id}?show=true`),
    },
    {
      name: "Editar",
      handleClick: (id) =>
        router.push(`/operations/claims/claim/${id}?show=true&edit=true`),
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
              `/tools/tasks/task?show=true&prev=poliza_claim&prev_id=${id}`
            ),
        },
        {
          name: "Cita",
          handleClick: (id) =>
            router.push(
              `/tools/calendar/addEvent?show=true&prev=poliza_claim&prev_id=${id}`
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
      polizaClaimStatusColor?.[status] ??
      polizaClaimStatusColor?.captura_documentos;

    const stageIndex = status
      ? Object.keys(polizaClaimStatus).findIndex((x) => x == status)
      : 0;

    return (
      <div className="flex flex-col gap-1 items-center">
        <div className={`flex justify-center bg-gray-200`}>
          {Object.keys(polizaClaimStatus).map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 border-t border-b border-l last:border-r border-gray-400`}
              style={{ background: index <= stageIndex ? color : "" }}
            />
          ))}
        </div>
        <p className="text-sm text-center">
          {polizaClaimStatus?.[status] ?? polizaClaimStatus?.captura_documentos}
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
          data?.items.map((claim, index) => {
            return (
              <tr
                key={index}
                className={clsx(
                  selectedContacts.includes(claim.id)
                    ? "bg-gray-200"
                    : undefined,
                  "hover:bg-indigo-100/40 cursor-default"
                )}
              >
                <td className="pr-7 pl-4 sm:w-12 relative">
                  {selectedContacts.includes(claim.id) && (
                    <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                  )}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      value={claim.id}
                      checked={selectedContacts.includes(claim.id)}
                      onChange={(e) =>
                        setSelectedContacts(
                          e.target.checked
                            ? [...selectedContacts, claim.id]
                            : selectedContacts.filter((p) => p !== claim.id)
                        )
                      }
                    />
                    <Menu
                      as="div"
                      className="relative hover:bg-slate-50/30 w-10 md:w-auto py-2 px-1 rounded-lg"
                    >
                      <MenuButton className="flex items-center">
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
                          className=" z-50 rounded-md bg-white py-2 shadow-lg focus:outline-none"
                        >
                          {itemActions.map((item) =>
                            !item.options ? (
                              <MenuItem
                                key={item.name}
                                disabled={item.disabled}
                                onClick={() => {
                                  item.handleClick &&
                                    item.handleClick(claim.id);
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
                                    <ChevronDownIcon className="h-6 w-6 ml-2" />
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
                                            option.handleClick(claim.id);
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
                            href={`/operations/claims/claim/${claim.id}?show=true`}
                          >
                            <p>{`${
                              claim?.insurance?.name ?? ""
                            } ${claim?.poliza?.poliza ?? ""} ${claim?.polizaType?.name ?? ""}`}</p>
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
                            href={`/operations/policies/policy/${claim?.poliza?.id}?show=true`}
                          >
                            <p className="text-center">
                              {claim?.poliza?.poliza}
                            </p>
                          </Link>
                        ) : column.row === "contact" ? (
                          <Link
                            href={`/sales/crm/contacts/contact/${claim?.poliza?.contact?.id}?show=true`}
                          >
                            <p className="text-center">
                              {claim?.poliza?.contact?.fullName}
                            </p>
                          </Link>
                        ) : column.row === "createdAt" ? (
                          <p className="text-center">
                            {moment(claim?.createdAt).format("DD/MM/YYYY")}
                          </p>
                        ) : column.row === "status" ? (
                          renderStage(claim?.status)
                        ) : (
                          claim[column.row] || "-"
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
        handleClick={() => deleteClaim(deleteId)}
        loading={loading}
      />
      <DeleteItemModal
        isOpen={isOpenDeleteMasive}
        setIsOpen={setIsOpenDeleteMasive}
        handleClick={() => deleteClaims()}
        loading={loading}
      />
    </Fragment>
  );
}
