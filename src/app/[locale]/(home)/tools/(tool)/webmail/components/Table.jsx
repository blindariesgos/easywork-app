"use client";
import clsx from "clsx";
import { getTokenGoogle } from "../../../../../../../lib/apis";
import axios from "axios";
import React, { useRef, useState } from "react";
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
import { MenuButton, MenuItem, MenuItems, Menu } from "@headlessui/react";
import Button from "@/src/components/form/Button";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Table({
  mails,
  selectedFolder = "INBOX",
  fetchData,
  setDMails,
  getAxiosMails,
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectMail, setSelectMail] = useState(mails);
  const session = useSession();
  const { selectOauth, selectedEmails, setSelectedEmails } = useAppContext();

  function toggleAll() {
    setSelectedEmails(checked || indeterminate ? [] : mails);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  const handleChangeAddCrm = () => {
    router.push("/sales/crm/leads/lead?show=true&page=1");
  };

  async function changeSelectLabelId(label) {
    const array = selectedEmails.map((element) => element.email.googleId);
    await updateLabelId(array, label);
    setSelectedEmails([]); // Limpiar la selección después de actualizar
  }

  async function updateLabelId(array, label) {
    const apiUrl =
      label === "inbox"
        ? `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/gmail/updatelabel/inbox/${session?.data.user.sub}/${selectOauth?.id}`
        : `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/gmail/updatelabel/${label}/${session?.data.user.sub}/${selectOauth?.id}`;

    await axios.post(apiUrl, { data: array });

    // Actualizar el estado local inmediatamente
    setDMails((prevMails) =>
      prevMails.map((mail) => {
        if (array.includes(mail.email.googleId)) {
          if (label === "read") {
            getTokenGoogle(session?.data.user.sub).then((res) => {
              console.log(res);
            });
            return {
              ...mail,
              email: {
                ...mail.email,
                folder: mail.email.folder.filter((f) => f !== "UNREAD"),
              },
            };
          } else if (label === "unread") {
            getTokenGoogle(session?.data.user.sub).then((res) => {
              console.log(res);
            });
            return {
              ...mail,
              email: {
                ...mail.email,
                folder: [...mail.email.folder, "UNREAD"],
              },
            };
          } else {
            return {
              ...mail,
              email: {
                ...mail.email,
                folder: [
                  ...mail.email.folder.filter((f) => f !== label),
                  label,
                ],
              },
            };
          }
        }
        return mail;
      })
    );

    // Eliminar los correos movidos a otras carpetas del estado local
    if (["spam", "trash", "inbox"].includes(label)) {
      setDMails((prevMails) =>
        prevMails.filter((mail) => !array.includes(mail.email.googleId))
      );
    }

    // Obtener los correos actualizados y solo actualizar los correos modificados
    const updatedMails = await getAxiosMails(selectedFolder);
    setDMails((prevMails) =>
      prevMails.map(
        (mail) =>
          updatedMails.find(
            (updatedMail) => updatedMail.email.googleId === mail.email.googleId
          ) || mail
      )
    );
  }

  const itemOptions = [
    {
      name: "Abrir email",
      onClick: (item) => {
        setSelectMail(item.email);
        router.push("/tools/webmail/?detail=true");
      },
    },
    {
      name: "Marcar como no leido",
      onClick: (item) => updateLabelId([item.email.googleId], "unread"),
    },
    selectedFolder.toLowerCase() !== "all"
      ? {
          name: "Mover a la carpeta",
          onClick: (item) => {},
        }
      : null,
    {
      name: "Marcar como correo no deseado",
      onClick: (item) => updateLabelId([item.email.googleId], "spam"),
    },
    {
      name: "Eliminar",
      onClick: (item) => updateLabelId([item.email.googleId], "trash"),
    },
    {
      name: "Excluir de CRM",
      onClick: (item) => {},
    },
    {
      name: "Crear tareas",
      onClick: (item) => {},
    },
    {
      name: "Crear eventos",
      onClick: (item) => {},
    },
    {
      name: "Eliminar permanentemente",
      onClick: (item) => updateLabelId([item.email.googleId], "delete"),
    },
  ].filter((item) => item !== null);

  const folderOptions = [
    {
      name: "Inbox",
      onClick: (item) => {
        !selectedEmails.length == 0
          ? changeSelectLabelId("inbox")
          : updateLabelId([item.email.googleId], "inbox");
      },
      value: "Inbox",
    },
    {
      name: "Spam",
      onClick: (item) => {
        !selectedEmails.length == 0
          ? changeSelectLabelId("spam")
          : updateLabelId([item.email.googleId], "spam");
      },
      value: "Spam",
    },
    {
      name: "Basura",
      onClick: (item) => {
        !selectedEmails.length == 0
          ? changeSelectLabelId("trash")
          : updateLabelId([item.email.googleId], "trash");
      },
      value: "Trash",
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
            <div className="flex px-2 justify-between bg-white font-semibold">
              <div className="flex">
                <div className="relative w-12 px-6">
                  <input
                    type="checkbox"
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                    ref={checkbox}
                    checked={checked}
                    onChange={toggleAll}
                  />
                </div>
                <div className="min-w-[12rem] py-3.5 ml-16 text-left text-sm text-easywork-main">
                  Seleccionar todo
                </div>
              </div>
              <div
                className="min-w-[12rem] py-3.5 text-sm text-easywork-main flex cursor-pointer"
                onClick={() => changeSelectLabelId("unread")}
              >
                <EnvelopeOpenIcon className="h-5 w-5" />
                Leer
              </div>
              <Menu as="div" className="relative">
                {selectedFolder.toLowerCase() !== "all" && (
                  <MenuButton className="flex items-center">
                    <div className="min-w-[12rem] py-3.5 text-sm text-easywork-main flex cursor-pointer">
                      <FolderArrowDownIcon className="h-5 w-5" />
                      Mover a carpeta
                    </div>
                  </MenuButton>
                )}
                <MenuItems
                  transition
                  anchor="bottom end"
                  className="z-50 w-48 rounded-md bg-white py-2 shadow-lg focus:outline-none"
                >
                  {folderOptions.map(
                    (subitem) =>
                      subitem.value.toLowerCase() !==
                        selectedFolder.toLowerCase() && (
                        <MenuItem key={subitem.name}>
                          {({ active }) => (
                            <div
                              className={clsx(
                                active ? "bg-gray-50 text-white" : "text-black",
                                "block px-3 py-1 text-sm leading-6  cursor-pointer"
                              )}
                              onClick={() => subitem.onClick(null)}
                            >
                              {subitem.name}
                            </div>
                          )}
                        </MenuItem>
                      )
                  )}
                </MenuItems>
              </Menu>
              <div
                className="min-w-[12rem] py-3.5 text-sm text-easywork-main flex cursor-pointer"
                onClick={() => changeSelectLabelId("spam")}
              >
                <ExclamationCircleIcon className="h-5 w-5" />
                Marcar como no deseado
              </div>
              <div
                className="min-w-[12rem] py-3.5 text-sm text-easywork-main flex cursor-pointer"
                onClick={() => {
                  changeSelectLabelId("trash");
                }}
              >
                <TrashIcon className="h-5 w-5" />
                Eliminar
              </div>
            </div>
            <div className="divide-y divide-gray-300">
              <div className="divide-y divide-gray-200 bg-white">
                {mails?.map((item, index) => {
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
                        selectedEmails.find((x) => x.id == item.id)
                          ? "bg-gray-50"
                          : undefined,
                        item.email.folder.includes("UNREAD")
                          ? "font-semibold"
                          : "",
                        "hover:bg-indigo-100/40 cursor-default grid grid-cols-12 gap-2 p-4"
                      )}
                    >
                      <div className="relative px-2 w-full h-full col-span-1">
                        {selectedEmails.find((x) => x.id == item.id) && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                        )}
                        <div className="flex items-center h-full">
                          <input
                            type="checkbox"
                            className="... mr-2"
                            value={item.id}
                            checked={
                              selectedEmails.find((x) => x.id == item.id)
                                ? true
                                : false
                            }
                            onChange={(e) =>
                              setSelectedEmails(
                                e.target.checked
                                  ? [...selectedEmails, item]
                                  : selectedEmails.filter((p) => p !== item)
                              )
                            }
                          />
                          <Menu
                            as="div"
                            className="hover:bg-slate-50/30 w-10 md:w-auto rounded-lg font-normal"
                          >
                            <MenuButton className="flex items-center">
                              <Bars3Icon
                                className="h-4 w-4 text-gray-400"
                                aria-hidden="true"
                              />
                            </MenuButton>
                            <MenuItems
                              transition
                              anchor="bottom start"
                              className={
                                "z-50 mt-2.5 w-64 rounded-md bg-white py-2 shadow-lg focus:outline-none"
                              }
                            >
                              {itemOptions.map((itemOp, index) => (
                                <MenuItem key={index}>
                                  {({ active }) => (
                                    <div
                                      onClick={() =>
                                        index !== 2 && itemOp.onClick(item)
                                      }
                                      className={classNames(
                                        active ? "bg-gray-50" : "",
                                        "block px-3 py-1 text-sm leading-6 text-black cursor-pointer"
                                      )}
                                    >
                                      {itemOp.name !== "Mover a la carpeta" ? (
                                        itemOp.name
                                      ) : (
                                        <Menu>
                                          <MenuButton className="flex items-center w-full">
                                            <div className="w-full flex items-center justify-between">
                                              <p>{itemOp.name}</p>
                                              <ChevronRightIcon className="h-6 w-6" />
                                            </div>
                                          </MenuButton>
                                          <MenuItems
                                            anchor={{
                                              to: "right start",
                                              gap: "12px",
                                            }}
                                            className="rounded-md bg-white py-2 z-50 shadow-lg focus:outline-none"
                                          >
                                            {folderOptions.map(
                                              (subitem) =>
                                                subitem.value.toLowerCase() !==
                                                  selectedFolder.toLowerCase() && (
                                                  <MenuItem key={subitem.name}>
                                                    {({ active }) => (
                                                      <div
                                                        className={clsx(
                                                          active
                                                            ? "bg-gray-50 text-white"
                                                            : "text-black",
                                                          "block px-3 py-1 text-sm leading-6 cursor-pointer"
                                                        )}
                                                        onClick={() =>
                                                          subitem.onClick(item)
                                                        }
                                                      >
                                                        {subitem.name}
                                                      </div>
                                                    )}
                                                  </MenuItem>
                                                )
                                            )}
                                          </MenuItems>
                                        </Menu>
                                      )}
                                    </div>
                                  )}
                                </MenuItem>
                              ))}
                            </MenuItems>
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
                            selectedEmails.includes(item)
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
                            selectedEmails.includes(item)
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
                            selectedEmails.includes(item)
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
                            selectedEmails.includes(item)
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
                            selectedEmails.includes(item)
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
                            selectedEmails.includes(item)
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
                            selectedEmails.includes(item)
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
                            selectedEmails.includes(item)
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
