"use client";
import {
  ChatBubbleBottomCenterIcon,
  EnvelopeIcon,
  PhoneIcon,
  Bars3Icon,
} from "@heroicons/react/20/solid";
import { FaWhatsapp } from "react-icons/fa6";
import clsx from "clsx";
import Image from "next/image";
import React, { useState, Fragment } from "react";
import useCrmContext from "@/src/context/crm";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { deletePolicyById, putPoliza } from "@/src/lib/apis";
import { handleApiError } from "@/src/utils/api/errors";
import { toast } from "react-toastify";
import { useRecruitmentTable } from "../../../../../../hooks/useCommon";
import SelectedOptionsTable from "@/src/components/SelectedOptionsTable";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { formatDate } from "@/src/utils/getFormatDate";
import useRecruitmentsContext from "@/src/context/recruitments";
import { useRouter } from "next/navigation";
import FooterTable from "@/src/components/FooterTable";
import DeleteItemModal from "@/src/components/modals/DeleteItem";
import moment from "moment";
import { recruitmentStages } from "@/src/utils/constants";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
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
  } = useRecruitmentsContext();
  const { t } = useTranslation();
  const router = useRouter();
  const { selectedContacts, setSelectedContacts } = useCrmContext();
  const { columnTable } = useRecruitmentTable();
  const [selectedColumns, setSelectedColumns] = useState(
    columnTable.filter((c) => c.check)
  );
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [isOpenDeleteMasive, setIsOpenDeleteMasive] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const deletePolicy = async (id) => {
    try {
      setLoading(true);
      const response = await deletePolicyById(id);
      toast.success(t("common:alert:delete-success"));
      mutate();
      setLoading(false);
      setIsOpenDelete(false);
    } catch (err) {
      setLoading(false);
      handleApiError(err.message);
    }
  };

  const deletePolicies = async () => {
    setLoading(true);
    const response = await Promise.allSettled(
      selectedContacts.map((policyId) => deletePolicyById(policyId))
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

  const changeStatusPolicies = async (status) => {
    setLoading(true);
    const body = {
      status: status.id,
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
      id: 1,
      name: "Crear tarea",
      disabled: true,
    },
    {
      id: 2,
      name: t("common:table:checkbox:change-stage"),
      onclick: changeStatusPolicies,
      disabled: true,
      selectOptions: [
        {
          id: "activa",
          name: "Activa",
        },
        {
          id: "expirada",
          name: "Expirada",
        },
        {
          id: "cancelada",
          name: "Cancelada",
        },
        {
          id: "en_proceso",
          name: "En proceso",
        },
      ],
    },
    {
      id: 1,
      name: t("common:buttons:delete"),
      onclick: () => setIsOpenDeleteMasive(true),
      disabled: true,
    },
  ];

  const itemActions = [
    {
      name: "Ver",
      handleClick: (id) =>
        router.push(`/agents-management/recruitment/agent/${id}?show=true`),
    },
    {
      name: "Editar",
      handleClick: (id) =>
        router.push(
          `/agents-management/recruitment/agent/${id}?show=true&edit=true`
        ),
    },
    {
      name: "Planificar",
      options: [
        {
          name: "Tarea",
          handleClick: (id) =>
            router.push(`/tools/tasks/task?show=true&prev=agent&prev_id=${id}`),
        },
        {
          name: "Cita",
          handleClick: (id) =>
            router.push(
              `/tools/calendar/addEvent?show=true&prev=agent&prev_id=${id}`
            ),
        },
      ],
    },
  ];

  const renderStage = (data) => {
    const stageIndex =
      recruitmentStages
        ?.map((stage) => stage.id)
        ?.findIndex((value) => data?.id == value) ?? -1;
    let color = "";
    if (stageIndex >= 0 && stageIndex <= 2) {
      color = recruitmentStages[stageIndex]?.color;
    } else if (stageIndex >= 3 && stageIndex <= 6) {
      color = recruitmentStages[6]?.color;
    } else if (stageIndex == 7) {
      color = recruitmentStages[7]?.color;
    }

    return (
      <div className="flex flex-col gap-1 items-center">
        <div className={`flex justify-center  ${"bg-gray-200"}`}>
          {new Array(5).fill(1).map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 border-t border-b border-l last:border-r border-gray-400`}
              style={{
                background: index <= stageIndex || stageIndex >= 3 ? color : "",
              }}
            />
          ))}
        </div>
        <p className="text-sm text-center">
          {recruitmentStages?.[stageIndex]?.name ?? recruitmentStages[0].name}
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
          data?.items.map((agent, index) => {
            return (
              <tr
                key={index}
                className={clsx(
                  selectedContacts.includes(agent?.agent?.id)
                    ? "bg-gray-200"
                    : undefined,
                  "hover:bg-indigo-100/40 cursor-default"
                )}
              >
                <td className="pr-7 pl-4 sm:w-12 relative">
                  {selectedContacts.includes(agent?.agent?.id) && (
                    <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                  )}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      value={agent?.agent?.id}
                      checked={selectedContacts.includes(agent?.agent?.id)}
                      onChange={(e) =>
                        setSelectedContacts(
                          e.target.checked
                            ? [...selectedContacts, agent?.agent?.id]
                            : selectedContacts.filter(
                                (p) => p !== agent?.agent?.id
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
                                    item.handleClick(agent?.agent?.id);
                                }}
                              >
                                <div
                                  // onClick={item.onClick}
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
                                            option.handleClick(
                                              agent?.agent?.id
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
                      <div
                        className={clsx(
                          "font-medium text-sm  text-black hover:text-primary"
                        )}
                      >
                        {column.row == "name" ? (
                          <Link
                            href={`/agents-management/recruitment/agent/${agent?.agent?.id}?show=true`}
                            className="flex gap-3 items-center"
                          >
                            <Image
                              className="h-8 w-8 rounded-full bg-zinc-200"
                              width={30}
                              height={30}
                              src={
                                agent?.agent?.user?.avatar || "/img/avatar.svg"
                              }
                              alt=""
                            />
                            <div className="flex flex-col">
                              <p className="text-start">{agent?.agent?.name}</p>
                              {agent.bio && (
                                <p className="text-start text-xs">
                                  {agent?.agent?.bio}
                                </p>
                              )}
                            </div>
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
                        ) : column.row === "email" ? (
                          <p className="text-center">
                            {agent?.user?.email ?? "-"}
                          </p>
                        ) : column.row === "origin" ? (
                          <p className="text-center">
                            {agent?.agent?.source?.name ?? "-"}
                          </p>
                        ) : column.row === "stage" ? (
                          <p className="flex justify-center">
                            {renderStage(agent?.agentRecruitmentStage)}
                          </p>
                        ) : column.row === "phone" ? (
                          agent?.user?.phone?.length > 0 ? (
                            <p className="text-center">{`+${agent?.user?.phone}`}</p>
                          ) : (
                            "-"
                          )
                        ) : column.row === "startDate" ? (
                          <p className="text-center">
                            {agent?.startDate
                              ? moment(agent?.startDate)
                                  .utc()
                                  .format("DD-MM-YYYY")
                              : "-"}
                          </p>
                        ) : column.row === "entryDate" ? (
                          <p className="text-center">
                            {agent?.entryDate
                              ? moment(agent?.entryDate)
                                  .utc()
                                  .format("DD-MM-YYYY")
                              : "-"}
                          </p>
                        ) : column.row === "updatedAt" ? (
                          <p className="text-center">
                            {formatDate(agent.updatedAt, "dd/MM/yyyy, hh:mm a")}
                          </p>
                        ) : column.row === "manager" ? (
                          <p className="text-center">
                            {(agent?.agent?.recruitmentManager?.name ??
                            agent?.agent?.recruitmentManager?.profile
                              ?.firstName)
                              ? `${agent?.agent?.recruitmentManager?.profile?.firstName} ${agent?.agent?.recruitmentManager?.profile?.lastName}`
                              : agent?.agent?.recruitmentManager?.username}
                          </p>
                        ) : (
                          <p className="text-center">
                            {agent[column.row] || "-"}
                          </p>
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
        handleClick={() => deletePolicy(deleteId)}
        loading={loading}
      />
      <DeleteItemModal
        isOpen={isOpenDeleteMasive}
        setIsOpen={setIsOpenDeleteMasive}
        handleClick={() => deletePolicies()}
        loading={loading}
      />
    </Fragment>
  );
}
