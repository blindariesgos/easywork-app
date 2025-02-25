"use client";
import {
  ChatBubbleBottomCenterIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  PhoneIcon,
  Bars3Icon,
} from "@heroicons/react/20/solid";
import { IoIosArrowDropdown } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa6";
import clsx from "clsx";
import React, { useState, Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useIndividualMeetTable } from "@/src/hooks/useCommon";
import ModalCrm from "@/src/components/ModalCrm";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { formatToCurrency } from "@/src/utils/formatters";
import useAppContext from "@/src/context/app";
import Image from "next/image";
import moment from "moment";
import useMeets from "../../hooks/useMeets";
import Assignments from "../../meet/components/Assignments";
import AssignmentsTable from "../../meet/components/AssignmentsTable";
import { getAllTasks } from "@/src/lib/apis";
import { FaAngleDown } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function MeetColumn({
  meet,
  selectedContacts,
  setSelectedContacts,
  selectedColumns,
  type,
  setDeleteId,
  setIsOpenDelete,
}) {
  const { lists } = useAppContext();
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const router = useRouter();
  const getTasks = async () => {
    setIsLoading(true);
    const response = await getAllTasks({
      config: {
        limit: 20,
        page: 1,
      },
      filters: {
        meetId: meet.id,
      },
    });
    if (response?.items?.length) {
      setTasks(response?.items);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getTasks();
  }, []);

  const itemActions = [
    {
      name: "Ver",
      handleClick: (meet) =>
        router.push(
          `/agents-management/meetings-and-sessions/${type}/meet/${meet.id}?show=true`
        ),
    },
    {
      name: "Crear",
      handleClick: (meet) => {
        if (meet?.agents?.length > 0) {
          router.push(
            `/agents-management/meetings-and-sessions/${type}/meet?show=true&prev=agent-meet&prev_id=${meet?.agents?.map((x) => x.id).join("^")}`
          );
        } else {
          toast.warning("La junta no tiene agente asignado");
        }
      },
    },
    {
      name: "Editar",
      handleClick: (meet) =>
        router.push(
          `/agents-management/meetings-and-sessions/${type}/meet/${meet.id}/edit?show=true`
        ),
    },
    {
      name: "Eliminar",
      handleClick: (meet) => {
        setDeleteId(meet.id);
        setIsOpenDelete(true);
      },
    },
  ];

  return (
    <Fragment>
      <tr
        className={clsx(
          selectedContacts.includes(meet.id) ? "bg-gray-200" : undefined,
          "hover:bg-indigo-100/40 cursor-default"
        )}
      >
        <td className="px-4 sm:w-12 relative">
          {selectedContacts.includes(meet.id) && (
            <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              value={meet.id}
              checked={selectedContacts.includes(meet.id)}
              onChange={(e) =>
                setSelectedContacts(
                  e.target.checked
                    ? [...selectedContacts, meet.id]
                    : selectedContacts.filter((p) => p !== meet.id)
                )
              }
            />
            <Menu
              as="div"
              className="relative hover:bg-slate-50/30   py-2 rounded-lg"
            >
              <MenuButton className="flex items-center">
                <Bars3Icon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </MenuButton>

              <MenuItems
                transition
                anchor="right start"
                className="z-50 rounded-md bg-white py-2 shadow-lg focus:outline-none"
              >
                {itemActions.map((item) =>
                  !item.options ? (
                    <MenuItem
                      key={item.name}
                      disabled={item.disabled}
                      onClick={() => {
                        item.handleClick && item.handleClick(meet);
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
                                  option.handleClick(meet.id);
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
            </Menu>
          </div>
        </td>
        {selectedColumns.length > 0 &&
          selectedColumns.map((column, index) => (
            <td className="py-4" key={index}>
              <div
                className={clsx(
                  "font-medium text-sm text-black hover:text-primary"
                )}
              >
                {column.row == "name" ? (
                  <div className="flex gap-x-1 items-center">
                    {tasks.length > 0 && (
                      <div
                        onClick={() => setShowTasks(!showTasks)}
                        className="h-5 w-5 cursor-pointer"
                      >
                        <IoIosArrowDropdown
                          className={clsx("h-5 w-5 text-primary", {
                            "rotate-180": showTasks,
                          })}
                        />
                      </div>
                    )}
                    <Link
                      href={`/agents-management/meetings-and-sessions/individuals/meet/${meet.id}?show=true`}
                    >
                      {meet?.title
                        ? `${meet?.title}${meet?.startTime ? ` - ${moment(meet?.startTime).format("DD/MM/YYYY")}` : ""}`
                        : "N/D"}
                    </Link>
                  </div>
                ) : column.row == "developmentManager" ? (
                  meet[column.row] ? (
                    <div className="flex gap-x-2 items-center justify-left">
                      <Image
                        className="h-6 w-6 rounded-full bg-zinc-200"
                        width={30}
                        height={30}
                        src={meet[column.row]?.avatar || "/img/avatar.svg"}
                        alt="avatar"
                      />
                      <div className="font-medium text-black">
                        {meet[column.row]?.name ??
                          `${meet[column.row]?.profile?.firstName} ${meet[column.row]?.profile?.lastName}`}
                      </div>
                    </div>
                  ) : (
                    "N/D"
                  )
                ) : column.row == "activities" ? (
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
                ) : column.row == "crm" ? (
                  <div className="flex justify-center">
                    <ModalCrm conections={meet[column.row]} />
                  </div>
                ) : column.row === "startTime" ? (
                  meet[column.row] ? (
                    <div className="flex justify-center">
                      <div className="capitalize bg-blue-100 px-2 py-1 rounded-full">
                        {moment(meet[column.row]).format("MMMM, DD hh:mm a")}
                      </div>
                    </div>
                  ) : null
                ) : column.row === "importePagar" ? (
                  `${lists?.policies?.currencies?.find((x) => x.id == meet?.currency?.id)?.symbol ?? ""} ${formatToCurrency(meet[column.row])}`
                ) : column.row === "status" ? (
                  meet[column.row]
                ) : column.row === "assignments" ? (
                  <Assignments tasks={tasks} isLoading={isLoading} />
                ) : (
                  <div className="flex justify-center">
                    {meet[column.row] || "-"}
                  </div>
                )}
              </div>
            </td>
          ))}
      </tr>
      {showTasks && (
        <tr>
          <td colSpan={selectedColumns.length}>
            <AssignmentsTable
              tasks={tasks}
              isLoading={isLoading}
              className={"pl-[76px]"}
            />
          </td>
        </tr>
      )}
    </Fragment>
  );
}
