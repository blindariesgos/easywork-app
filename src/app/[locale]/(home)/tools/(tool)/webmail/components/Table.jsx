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

export default function Table({ mails }) {
  const { t } = useTranslation();
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [mailsData, setMailsData] = useState(mails);
  const session = useSession();

  useEffect(() => {
    console.log(mailsData);
  }, [mailsData]);

  function toggleAll() {
    setSelectedTasks(checked || indeterminate ? [] : mails);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  return (
<div className="flow-root">
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
            {mailsData && mailsData.map((mail) => {
              const subjectHeader = mail.payload.headers.find(header => header.name === "Subject");
              const fromHeader = mail.payload.headers.find(header => header.name === "From");
              const dateHeader = mail.payload.headers.find(header => header.name === "Date");

              let subject = subjectHeader ? subjectHeader.value : "";
              let from = fromHeader ? fromHeader.value.split(" <")[0] : "";
              let date = dateHeader ? new Date(dateHeader.value) : new Date();

              subject = subject.length > 60 ? `${subject.substring(0, 60)}...` : subject;

              const now = new Date();
              let formattedDate;
              if (date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
                formattedDate = date.toLocaleTimeString();
              } else {
                formattedDate = date.toLocaleDateString();
              }

              return (
                <div key={mail.id} className={clsx(selectedTasks.includes(mail) ? "bg-gray-50" : undefined, "hover:bg-indigo-100/40 cursor-default grid grid-cols-8 gap-2 p-4")}>
                  <div className="relative px-7 sm:w-12 sm:px-6 col-span-1">
                    {selectedTasks.includes(mail) && <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />}
                    <input
                      type="checkbox"
                      className="..."
                      value={mail.id}
                      checked={selectedTasks.includes(mail)}
                      onChange={(e) => setSelectedTasks(e.target.checked ? [...selectedTasks, mail] : selectedTasks.filter((p) => p !== mail))}
                    />
                  </div>
                  <div className={clsx("whitespace-nowrap py-1 pr-3 text-sm font-medium", selectedTasks.includes(mail) ? "text-indigo-600" : "text-gray-900") + " col-span-5"}>
                    {subject}
                  </div>
                  <div className={clsx("whitespace-nowrap py-1 pr-3 text-sm font-medium", selectedTasks.includes(mail) ? "text-indigo-600" : "text-gray-900") + " col-span-1"}>
                    {from}
                  </div>
                  <div className={clsx("whitespace-nowrap py-1 pr-3 text-sm font-medium", selectedTasks.includes(mail) ? "text-indigo-600" : "text-gray-900") + " col-span-1 text-right"}>
                    {formattedDate}
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
