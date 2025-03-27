"use client";
import clsx from "clsx";
import { getTokenGoogle } from "../../../../../../../lib/apis";
import axios from "axios";
import React, { Fragment, useRef, useState } from "react";
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
import moment from "moment";

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
    setSelectedEmails(checked || indeterminate ? [] : mails.map((x) => x.id));
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  const handleChangeAddCrm = () => {
    router.push("/sales/crm/leads/lead?show=true&page=1");
  };

  async function changeSelectLabelId(label) {
    // const array = selectedEmails.map((element) => element.email.googleId);
    // await updateLabelId(array, label);
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
              // console.log(res);
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
              // console.log(res);
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

  const handleOpenEmail = (item) => {
    setSelectMail(item.email);
    router.push("/tools/webmail/?detail=true");
  };

  const clearFrom = (from) => {
    // Elimina las comillas dobles y las barras invertidas
    let clear = from.replace(/["\\]/g, "");

    // Elimina todo lo que está entre los símbolos < y >
    clear = clear.replace(/<[^>]*>/g, "");

    return clear;
  };

  return (
    <div className="flow-root">
      <EmailBody
        colorTag="bg-easywork-main"
        selectMail={selectMail}
        updateLabelId={updateLabelId}
        fetchData={fetchData}
      />
      <div className="overflow-x-auto">
        <div className="min-h-[60vh] h-full">
          <table className="min-w-full rounded-md bg-gray-100 table-auto relative ">
            <thead className="text-sm bg-white drop-shadow-sm sticky top-0 z-10">
              <tr>
                <th
                  colSpan={8}
                  className="relative pl-4 pr-7 rounded-s-xl bg-white"
                >
                  <div className="flex gap-6">
                    <div className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />

                      <div className=" py-3.5  text-left text-sm text-easywork-main">
                        Seleccionar todo
                      </div>
                    </div>
                    {selectedEmails.length > 0 && (
                      <Fragment>
                        <div
                          className="py-3.5 text-sm text-easywork-main flex cursor-pointer gap-2"
                          onClick={() => changeSelectLabelId("unread")}
                        >
                          <EnvelopeOpenIcon className="h-5 w-5" />
                          Leer
                        </div>
                        <Menu as="div" className="relative">
                          {selectedFolder.toLowerCase() !== "all" && (
                            <MenuButton className="flex items-center">
                              <div className="py-3.5 text-sm text-easywork-main flex cursor-pointer gap-2">
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
                                          active
                                            ? "bg-gray-50 text-white"
                                            : "text-black",
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
                          className="py-3.5 text-sm text-easywork-main flex cursor-pointer gap-2"
                          onClick={() => changeSelectLabelId("spam")}
                        >
                          <ExclamationCircleIcon className="h-5 w-5" />
                          Marcar como no deseado
                        </div>
                        <div
                          className="py-3.5 text-sm text-easywork-main flex cursor-pointer gap-2"
                          onClick={() => {
                            changeSelectLabelId("trash");
                          }}
                        >
                          <TrashIcon className="h-5 w-5" />
                          Eliminar
                        </div>
                      </Fragment>
                    )}
                  </div>
                </th>
                <th className="rounded-e-xl"></th>
              </tr>
            </thead>
            <tbody className="divide-y bg-gray-100 divide-gray-200">
              {/* <div className="divide-y divide-gray-200 bg-white"> */}
              {mails?.map((item, index) => {
                return (
                  <tr
                    key={item.id}
                    className={clsx(
                      "hover:bg-indigo-100/40 cursor-default relative",
                      {
                        "bg-gray-200": selectedEmails.includes(item.id),
                        "font-semibold": item.email.folder.includes("UNREAD"),
                      }
                    )}
                  >
                    <td className="relative px-4 py-4">
                      {selectedEmails.includes(item.id) && (
                        <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                      )}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          value={item.id}
                          checked={selectedEmails.includes(item.id)}
                          onChange={(e) =>
                            setSelectedEmails(
                              e.target.checked
                                ? [...selectedEmails, item.id]
                                : selectedEmails.filter((p) => p !== item.id)
                            )
                          }
                        />
                        <Menu
                          as="div"
                          className="relative hover:bg-slate-50/30 py-2 rounded-lg"
                        >
                          <MenuButton className="flex items-center">
                            <Bars3Icon
                              className="h-5 w-5 text-gray-400"
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
                                    className={clsx(
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
                    </td>
                    <td>
                      <p className="py-1 text-sm pr-2">
                        {clearFrom(item?.email?.from)}
                      </p>
                    </td>
                    <td>
                      <p
                        className="whitespace-nowrap py-1 pr-2 text-sm cursor-pointer"
                        onClick={handleOpenEmail}
                      >
                        {item?.email?.subject ?? "No disponible"}
                      </p>
                    </td>

                    <td>
                      <p className="py-1 pr-3 text-sm text-center">
                        {moment(item.email.date).format("DD MMM YYYY")}
                      </p>
                    </td>
                    <td>
                      <Button
                        label="CRM"
                        buttonStyle="secondary"
                        className="px-1 py-1"
                        onclick={handleChangeAddCrm}
                      />
                    </td>
                    <td>
                      <Button
                        label="Tarea"
                        buttonStyle="secondary"
                        className="px-1 py-1"
                      />
                    </td>
                    <td>
                      <Button
                        label="Chat"
                        buttonStyle="secondary"
                        className="px-1 py-1"
                      />
                    </td>
                    <td>
                      <Button
                        label="Eventos"
                        buttonStyle="secondary"
                        className="px-1 py-1"
                      />
                    </td>
                    <td>
                      <Button
                        label="Publicar feed"
                        buttonStyle="secondary"
                        className="px-1 py-1"
                      />
                    </td>
                  </tr>
                );
              })}
              {/* </div> */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
