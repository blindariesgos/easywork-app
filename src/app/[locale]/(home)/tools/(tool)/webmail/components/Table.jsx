"use client";
import clsx from "clsx";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
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
import { Pagination } from "../../../../../../../components/pagination/Pagination";

export default function Table({ mails, selectedFolder = "INBOX" }) {
  const router = useRouter();
  const { t } = useTranslation();
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [mailsData, setMailsData] = useState(mails);
  const [selectMail, setSelectMail] = useState(mails);
  const session = useSession();

  useEffect(() => {
    const filteredMails = mails.filter(
      (mail) => mail.email.folder && mail.email.folder.includes(selectedFolder)
    );
    setMailsData(filteredMails);
  }, [mails, selectedFolder]);

  function toggleAll() {
    setSelectedTasks(checked || indeterminate ? [] : mails);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  return (
    <div className="flow-root">
      <EmailBody colorTag="bg-green-100" selectMail={selectMail} />
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="relative overflow-hidden sm:rounded-lg">
            <div className="flex justify-around bg-white">
              <div className="flex">
                <div className="relative w-12 px-6">
                  <input
                    type="checkbox"
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    ref={checkbox}
                    checked={checked}
                    onChange={toggleAll}
                  />
                </div>
                <div className="min-w-[12rem] py-3.5 text-left text-sm text-easywork-main">
                  Seleccionar todo
                </div>
              </div>
              <div className="min-w-[12rem] py-3.5 text-sm text-easywork-main flex">
                <EnvelopeOpenIcon className="h-5 w-5" />
                Leer
              </div>
              <div className="min-w-[12rem] py-3.5 text-sm text-easywork-main flex">
                <FolderArrowDownIcon className="h-5 w-5" />
                Mover a carpeta
              </div>
              <div className="min-w-[12rem] py-3.5 text-sm text-easywork-main flex">
                <ExclamationCircleIcon className="h-5 w-5" />
                Marcar como correo no deseado
              </div>
              <div className="min-w-[12rem] py-3.5 text-sm text-easywork-main flex">
                <TrashIcon className="h-5 w-5" />
                Eliminar
              </div>
            </div>
            <div className="divide-y divide-gray-300">
              <div className="divide-y divide-gray-200 bg-white">
                {mailsData &&
                  mailsData.map((item) => {
                    // const subjectHeader = mail.payload.headers.find(
                    //   (header) => header.name === "Subject"
                    // );
                    // const fromHeader = mail.payload.headers.find(
                    //   (header) => header.name === "From"
                    // );
                    // const dateHeader = mail.payload.headers.find(
                    //   (header) => header.name === "Date"
                    // );

                    let subjectFormat = item.email.subject ? item.email.subject : "";
                    let fromFormat =item.email.from
                      ? item.email.from.split(" <")[0]
                      : "";
                    let date = item.email.date
                      ? new Date(item.email.date)
                      : new Date();

                    subjectFormat =
                      subjectFormat.length > 80
                        ? `${subjectFormat.substring(0, 80)}...`
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
                        onClick={() => {
                          setSelectMail(item.email);
                          router.push("/tools/webmail/?detail=true");
                        }}
                        className={clsx(
                          selectedTasks.includes(item)
                            ? "bg-gray-50"
                            : undefined,
                          "hover:bg-indigo-100/40 cursor-default grid grid-cols-9 gap-2 p-4"
                        )}
                      >
                        <div className="relative px-7 sm:w-12 sm:px-6 col-span-1">
                          {selectedTasks.includes(item) && (
                            <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                          )}
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
                        </div>
                        <div
                          className={
                            clsx(
                              "whitespace-nowrap py-1 pr-3 text-sm font-medium",
                              selectedTasks.includes(item)
                                ? "text-indigo-600"
                                : "text-gray-900"
                            ) + " col-span-5"
                          }
                        >
                          {subjectFormat}
                        </div>
                        <div
                          className={
                            clsx(
                              "whitespace-nowrap py-1 pr-3 text-sm font-medium",
                              selectedTasks.includes(item)
                                ? "text-indigo-600"
                                : "text-gray-900"
                            ) + " col-span-2"
                          }
                        >
                          {fromFormat}
                        </div>
                        <div
                          className={
                            clsx(
                              "whitespace-nowrap py-1 pr-3 text-sm font-medium",
                              selectedTasks.includes(item)
                                ? "text-indigo-600"
                                : "text-gray-900"
                            ) + " col-span-1 text-right"
                          }
                        >
                          {dateFormat}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <Pagination totalPages={10} bgColor="bg-gray-300" />
      </div>
    </div>
  );
}
