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
          <div className="relative overflow-hidden   sm:rounded-lg">
            <div className="flex justify-around bg-white">
              <div>
                <div className="flex">
                  <div scope="col" className="relative w-12 px-6">
                    <input
                      type="checkbox"
                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      ref={checkbox}
                      checked={checked}
                      onChange={toggleAll}
                    />
                  </div>
                  <div
                    scope="col"
                    className="min-w-[12rem] py-3.5 text-left text-sm text-easywork-main"
                  >
                    Seleccionar todo
                  </div>
                </div>
              </div>
              <div className="min-w-[12rem] py-3.5 text-sm text-easywork-main flex">
                <EnvelopeOpenIcon className="h-5 w-5" />
                <p className="ml-2">Leer</p>
              </div>
              <div className="min-w-[12rem] py-3.5 text-sm text-easywork-main flex">
                <FolderArrowDownIcon className="h-5 w-5" />
                <p className="ml-2">Mover a carpeta</p>
              </div>
              <div className="min-w-[12rem] py-3.5 text-sm text-easywork-main flex">
                <ExclamationCircleIcon className="h-5 w-5" />
                <p className="ml-2">Marcar como correo no deseado</p>
              </div>
              <div className="min-w-[12rem] py-3.5 text-sm text-easywork-main flex">
                <TrashIcon className="h-5 w-5" />
                <p className="ml-2">Eliminar</p>
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-300">
              <tbody className="divide-y divide-gray-200 bg-white">
                {mailsData &&
                  mailsData.map((task) => (
                    <tr
                      key={task.id}
                      className={clsx(
                        selectedTasks.includes(task) ? "bg-gray-50" : undefined,
                        "hover:bg-indigo-100/40 cursor-default"
                      )}
                    >
                      <td className="relative px-7 sm:w-12 sm:px-6">
                        {selectedTasks.includes(task) && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                        )}
                        <input
                          type="checkbox"
                          className="..."
                          value={task.id}
                          checked={selectedTasks.includes(task)}
                          onChange={(e) =>
                            setSelectedTasks(
                              e.target.checked
                                ? [...selectedTasks, task]
                                : selectedTasks.filter((p) => p !== task)
                            )
                          }
                        />
                      </td>
                      <td
                        className={clsx(
                          "whitespace-nowrap py-4 pr-3 text-sm font-medium",
                          selectedTasks.includes(task)
                            ? "text-indigo-600"
                            : "text-gray-900"
                        )}
                      >
                        {task.payload.headers.map((data) => (
                          <>
                            <td>{data.name == "Subject" && data.value}</td>
                          </>
                        ))}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
