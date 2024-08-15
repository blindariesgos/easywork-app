"use client";
import clsx from "clsx";
import Image from "next/image";
import axios from "axios";
import React, { useRef, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import {
  ExclamationCircleIcon,
  TrashIcon,
  FolderArrowDownIcon,
  EnvelopeOpenIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import EmailBody from "./EmailBody";
import { useRouter } from "next/navigation";
import { Bars3Icon, ChevronRightIcon } from "@heroicons/react/20/solid";
import useAppContext from "../../../../../../../context/app";
import {
  MenuButton,
  MenuItem,
  MenuItems,
  Menu,
  Transition,
} from "@headlessui/react";
import Button from "@/src/components/form/Button";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Table({ mails, selectedFolder = "INBOX", fetchData }) {
  const router = useRouter();
  const { t } = useTranslation();
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [mailsData, setMailsData] = useState(mails);
  const [selectMail, setSelectMail] = useState(mails);
  const session = useSession();
  const { selectOauth } = useAppContext();

  function toggleAll() {
    setSelectedTasks(checked || indeterminate ? [] : mails);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  async function deleteEmails() {
    const array = [];
    selectedTasks.forEach((element) => {
      array.push(element.email.googleId);
    });
    updateLabelId(array, "trash");
  }

  const handleChangeAddCrm = () => {
    router.push("/sales/crm/leads/lead?show=true&page=1");
  };

  async function updateLabelId(array, label) {
    if (label === "inbox") {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/google/updatelabel/inbox/${session.data.user.id}/${selectOauth?.id}`,
        {
          data: array,
        }
      );
    } else {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/google/updatelabel/${label}/${session.data.user.id}/${selectOauth?.id}`,
        {
          data: array,
        }
      );
    }

    fetchData();
  }

  const itemOptions = [
    { name: "Marcar como no leido", onClick: "" },
    { name: "Mover a la carpeta", onClick: "" },
    { name: "Marcar como correo no deseado", onClick: "" },
    { name: "Eliminar", onClick: (item) => updateLabelId([item], "trash") },
    { name: "Excluir de CRM", onClick: "" },
    { name: "Crear tareas", onClick: "" },
    { name: "Crear eventos", onClick: "" },
    { name: "Eliminar permanentemente", onClick: "" },
  ];

  const folderOptions = [
    { name: "Inbox", onClick: (item) => updateLabelId([item], "inbox") },
    { name: "Spam", onClick: (item) => updateLabelId([item], "spam") },
    {
      name: "Archivados",
      onClick: (item) => updateLabelId([item], "archived"),
    },
  ];

  return (
    <div className="flow-root">
      <EmailBody
        colorTag="bg-easywork-main"
        selectMail={selectMail}
        updateLabelId={updateLabelId}
        fetchData={fetchData}
      />
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="relative overflow-hidden sm:rounded-lg">
            <div className="flex justify-around bg-white">
              <div className="flex">
                <div className="relative w-12 px-6">
                  <input
                    type="checkbox"
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                    ref={checkbox}
                    checked={checked}
                    onChange={toggleAll}
                  />
                </div>
                <div className="min-w-[12rem] py-3.5 text-left text-sm text-easywork-main">
                  Seleccionar todo
                </div>
              </div>
              <div className="min-w-[12rem] py-3.5 text-sm text-easywork-main flex cursor-pointer">
                <EnvelopeOpenIcon className="h-5 w-5" />
                Leer
              </div>
              <div className="min-w-[12rem] py-3.5 text-sm text-easywork-main flex cursor-pointer">
                <FolderArrowDownIcon className="h-5 w-5" />
                Mover a carpeta
              </div>
              <div className="min-w-[12rem] py-3.5 text-sm text-easywork-main flex cursor-pointer">
                <ExclamationCircleIcon className="h-5 w-5" />
                Marcar como correo no deseado
              </div>
              <div
                className="min-w-[12rem] py-3.5 text-sm text-easywork-main flex cursor-pointer"
                onClick={() => {
                  deleteEmails();
                }}
              >
                <TrashIcon className="h-5 w-5" />
                Eliminar
              </div>
            </div>
            <div className="divide-y divide-gray-300">
              <div className="divide-y divide-gray-200 bg-white">
                {mails?.map((item) => {
                  let subjectFormat = item.email.subject
                    ? item.email.subject
                    : "";
                  let fromFormat = item.email.from
                    ? item.email.from.split(" <")[0]
                    : "";
                  let date = item.email.date
                    ? new Date(item.email.date)
                    : new Date();

                  fromFormat =
                    fromFormat.length > 10
                      ? `${fromFormat.substring(0, 15)}.`
                      : fromFormat;

                  subjectFormat =
                    subjectFormat.length > 40
                      ? `${subjectFormat.substring(0, 40)}.`
                      : subjectFormat;

                  const now = new Date();
                  let dateFormat;
                  if (
                    date.getDate() === now.getDate() &&
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear()
                  ) {
                    dateFormat = date.toLocaleTimeString();
                  } else {
                    dateFormat = date.toLocaleDateString();
                  }

                  return (
                    <div
                      key={item.id}
                      className={clsx(
                        selectedTasks.includes(item) ? "bg-gray-50" : undefined,
                        item.email.folder.includes("UNREAD")
                          ? "font-medium"
                          : "",
                        "hover:bg-indigo-100/40 cursor-default grid grid-cols-12 gap-2 p-4"
                      )}
                    >
                      <div className="relative px-2 w-full h-full col-span-1">
                        {selectedTasks.includes(item) && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                        )}
                        <div className="flex items-center h-full">
                          <input
                            type="checkbox"
                            className="..."
                            value={item.id}
                            checked={selectedTasks.includes(item)}
                            onChange={(e) =>
                              setSelectedTasks(
                                e.target.checked
                                  ? [...selectedTasks, item]
                                  : selectedTasks.filter((p) => p !== item)
                              )
                            }
                          />
                          <Menu
                            as="div"
                            className="hover:bg-slate-50/30 w-10 md:w-auto rounded-lg font-normal"
                          >
                            <MenuButton className="-m-1.5 flex items-center p-1.5">
                              <Bars3Icon
                                className="ml-3 h-4 w-4 text-gray-400"
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
                              <MenuItems className="absolute left-0 z-50 mt-2.5 w-64 rounded-md bg-white py-2 shadow-lg focus:outline-none">
                                {itemOptions.map((itemOp, index) => (
                                  <MenuItem key={index}>
                                    {({ active }) => (
                                      <div
                                        onClick={() =>
                                          itemOp.onClick(item.email.googleId)
                                        }
                                        className={classNames(
                                          active ? "bg-gray-50" : "",
                                          "block px-3 py-1 text-sm leading-6 text-black cursor-pointer"
                                        )}
                                      >
                                        {itemOp.name !==
                                        "Mover a la carpeta" ? (
                                          itemOp.name
                                        ) : (
                                          <Menu>
                                            <MenuButton className="flex items-center">
                                              <div className="w-full flex items-center justify-between">
                                                {itemOp.name}
                                                <ChevronRightIcon className="h-6 w-6 ml-4" />
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
                                                  gap: "12px",
                                                }}
                                                className="rounded-md bg-white py-2 z-50 shadow-lg focus:outline-none"
                                              >
                                                {folderOptions.map(
                                                  (subitem) => (
                                                    <MenuItem
                                                      key={subitem.name}
                                                    >
                                                      {({ active }) => (
                                                        <div
                                                          className={clsx(
                                                            active
                                                              ? "bg-gray-50 text-white"
                                                              : "text-black",
                                                            "block px-3 py-1 text-sm leading-6  cursor-pointer"
                                                          )}
                                                          onClick={() =>
                                                            subitem.onClick(
                                                              item.email
                                                                .googleId
                                                            )
                                                          }
                                                        >
                                                          {subitem.name}
                                                        </div>
                                                      )}
                                                    </MenuItem>
                                                  )
                                                )}
                                              </MenuItems>
                                            </Transition>
                                          </Menu>
                                        )}
                                      </div>
                                    )}
                                  </MenuItem>
                                ))}
                              </MenuItems>
                            </Transition>
                          </Menu>
                        </div>
                      </div>
                      <div
                        onClick={() => {
                          setSelectMail(item.email);
                          router.push("/tools/webmail/?detail=true");
                        }}
                        className={
                          clsx(
                            "whitespace-nowrap py-1 pr-3 text-sm ",
                            selectedTasks.includes(item)
                              ? "text-indigo-600"
                              : "text-gray-900"
                          ) + " col-span-3"
                        }
                      >
                        {subjectFormat}
                      </div>
                      <div
                        onClick={() => {
                          setSelectMail(item.email);
                          router.push("/tools/webmail/?detail=true");
                        }}
                        className={
                          clsx(
                            "whitespace-nowrap py-1 pr-3 text-sm ",
                            selectedTasks.includes(item)
                              ? "text-indigo-600"
                              : "text-gray-900"
                          ) + " col-span-2 text-right"
                        }
                      >
                        {fromFormat}
                      </div>
                      <div
                        onClick={() => {
                          setSelectMail(item.email);
                          router.push("/tools/webmail/?detail=true");
                        }}
                        className={
                          clsx(
                            "whitespace-nowrap py-1 pr-3 text-sm ",
                            selectedTasks.includes(item)
                              ? "text-indigo-600"
                              : "text-gray-900"
                          ) + " col-span-1 text-center"
                        }
                      >
                        {dateFormat}
                      </div>
                      <div
                        className={
                          clsx(
                            "whitespace-nowrap",
                            selectedTasks.includes(item)
                              ? "text-indigo-600"
                              : "text-gray-900"
                          ) + " col-span-1 flex justify-center"
                        }
                      >
                        <Button
                          label="CRM"
                          buttonStyle="secondary"
                          className="px-1 py-1"
                          onclick={handleChangeAddCrm}
                        />
                      </div>
                      <div
                        className={
                          clsx(
                            "whitespace-nowrap",
                            selectedTasks.includes(item)
                              ? "text-indigo-600"
                              : "text-gray-900"
                          ) + " col-span-1 flex justify-center"
                        }
                      >
                        <Button
                          label="Tarea"
                          buttonStyle="secondary"
                          className="px-1 py-1"
                        />
                      </div>
                      <div
                        className={
                          clsx(
                            "whitespace-nowrap",
                            selectedTasks.includes(item)
                              ? "text-indigo-600"
                              : "text-gray-900"
                          ) + " col-span-1  flex justify-center"
                        }
                      >
                        <Button
                          label="Chat"
                          buttonStyle="secondary"
                          className="px-1 py-1"
                        />
                      </div>
                      <div
                        className={
                          clsx(
                            "whitespace-nowrap",
                            selectedTasks.includes(item)
                              ? "text-indigo-600"
                              : "text-gray-900"
                          ) + " col-span-1"
                        }
                      >
                        <Button
                          label="Eventos"
                          buttonStyle="secondary"
                          className="px-1 py-1"
                        />
                      </div>
                      <div
                        className={
                          clsx(
                            "whitespace-nowrap",
                            selectedTasks.includes(item)
                              ? "text-indigo-600"
                              : "text-gray-900"
                          ) + " col-span-1"
                        }
                      >
                        <Button
                          label="Publicar feed"
                          buttonStyle="secondary"
                          className="px-1 py-1"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
