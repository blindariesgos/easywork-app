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
import Image from "next/image";
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
import { deletePolicyById, putPoliza } from "@/src/lib/apis";
import { handleApiError } from "@/src/utils/api/errors";
import { toast } from "react-toastify";
import { useRecruitmentTable } from "../../../../../../hooks/useCommon";
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
} from "@headlessui/react";
import { formatDate } from "@/src/utils/getFormatDate";
import useAccompanimentsContext from "@/src/context/accompaniments";
import { useRouter } from "next/navigation";
import { formatToCurrency } from "@/src/utils/formatters";
import useAppContext from "@/src/context/app";
import FooterTable from "@/src/components/FooterTable";
import DeleteItemModal from "@/src/components/modals/DeleteItem";
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
  } = useAccompanimentsContext();
  const { lists } = useAppContext();
  const { t } = useTranslation();
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
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
        `Se elimino con exito ${response.filter((x) => x.status == "fulfilled").length} elemento(s) de ${selectedContacts.length} seleccionado(s)`
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
    console.log({ response });
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
      disabled: true,
    },
    {
      name: "Actividades",
      disabled: true,
    },
    {
      name: "Asignar GDD",
      disabled: true,
    },
    {
      name: "Reasignar GDD",
      disabled: true,
    },
  ];

  const getStatus = (isActive) => {
    return (
      <div className="flex flex-col justify-center items-center">
        <div className="flex border opacity-40 w-[100px]">
          <div
            className={clsx("w-[50px] h-[10px] border border-black", {
              "bg-[#00CD26] ": isActive,
            })}
          />
          <div
            className={clsx("w-[50px] h-[10px] border border-black", {
              "bg-[#CD0700]": !isActive,
            })}
          />
        </div>
        <p className="text-gray-50 text-sm">
          {isActive ? "Activo" : "Inactivo"}
        </p>
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
          <p className="text-lg font-medium text-gray-400">
            {t("operations:policies:table:not-data")}
          </p>
        </div>
      </div>
    );
  }

  const renderStage = (data) => {
    const stageIndex = -1;

    const getColorClass = (item, currentIndex, stageInd) => {
      if (currentIndex <= stageInd && stageInd != -1) return "bg-yellow-500";
      // if (item && stageInd == -1 )
      //   return "bg-green-primary";
      // if (item && stageInd == -1)
      //   return "bg-red-500";

      return "";
    };

    return (
      <div className="flex flex-col gap-1 items-center">
        <div className={`flex justify-center  ${"bg-gray-200"}`}>
          {new Array(5).fill(1).map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 ${getColorClass(data, index, stageIndex)} border-t border-b border-l last:border-r border-gray-400`}
            />
          ))}
        </div>
        <p className="text-sm">Contacto Inicial</p>
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
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="relative sm:rounded-lg h-[60vh]">
            <table className="min-w-full rounded-md bg-gray-100 table-auto relative">
              <thead className="text-sm bg-white drop-shadow-sm sticky top-0 z-10">
                <tr>
                  <th
                    scope="col"
                    className="relative px-4  rounded-xl py-5 flex gap-2 items-center"
                  >
                    <input
                      type="checkbox"
                      className=" h-4 w-4 border-gray-300 text-primary focus:ring-primary"
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
                  data?.items.map((agent, index) => {
                    return (
                      <tr
                        key={index}
                        className={clsx(
                          selectedContacts.includes(agent.id)
                            ? "bg-gray-200"
                            : undefined,
                          "hover:bg-indigo-100/40 cursor-default"
                        )}
                      >
                        <td className="pr-7 pl-4 sm:w-12 relative">
                          {selectedContacts.includes(agent.id) && (
                            <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                          )}
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              value={agent.id}
                              checked={selectedContacts.includes(agent.id)}
                              onChange={(e) =>
                                setSelectedContacts(
                                  e.target.checked
                                    ? [...selectedContacts, agent.id]
                                    : selectedContacts.filter(
                                        (p) => p !== agent.id
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
                                            item.handleClick(agent.id);
                                          item.handleClickContact &&
                                            item.handleClickContact(
                                              agent?.contact?.id
                                            );
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
                                                    option.handleClick(
                                                      agent.id
                                                    );
                                                  option.handleClickContact &&
                                                    option.handleClickContact(
                                                      agent?.contact?.id
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
                                    href={`/agents-management/recruitment/agent/${agent.id}?show=true`}
                                    className="flex gap-3 items-center"
                                  >
                                    <Image
                                      className="h-8 w-8 rounded-full bg-zinc-200"
                                      width={30}
                                      height={30}
                                      src={
                                        agent?.user?.avatar || "/img/avatar.svg"
                                      }
                                      alt=""
                                    />
                                    <div className="flex flex-col">
                                      <p className="text-start">
                                        {agent?.name}
                                      </p>
                                      {agent.bio && (
                                        <p className="text-start text-xs">
                                          {agent?.bio}
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
                                ) : column.row === "stage" ? (
                                  <p className="flex justify-center">
                                    {renderStage(agent.stage)}
                                  </p>
                                ) : column.row === "phone" ? (
                                  agent?.user?.phone?.length > 0 ? (
                                    <p className="text-center">{`+${agent?.user?.phone}`}</p>
                                  ) : (
                                    "-"
                                  )
                                ) : column.row === "date" ? (
                                  <p className="text-center">
                                    {moment().format("DD-MM-YYYY")}
                                  </p>
                                ) : column.row === "updatedAt" ? (
                                  <p className="text-center">
                                    {formatDate(
                                      agent.updatedAt,
                                      "dd/MM/yyyy, hh:mm a"
                                    )}
                                  </p>
                                ) : column.row === "isActive" ? (
                                  getStatus(agent?.user?.isActive)
                                ) : column.row === "manager" ? (
                                  <p className="text-center">
                                    {agent?.recruitmentManager?.name ??
                                      agent?.recruitmentManager?.username}
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
