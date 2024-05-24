"use client";
import clsx from "clsx";
import Image from "next/image";
import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  ExclamationCircleIcon,
  TrashIcon,
  FolderArrowDownIcon,
  EnvelopeOpenIcon,
} from "@heroicons/react/24/outline";
import { getApiError } from "../../../../../../../utils/getApiErrors";
import axios from "axios";
import { useSession } from "next-auth/react";
import { getTokenGoogle } from "../../../../../../../lib/apis";
import useAppContext from "../../../../../../../context/app/index";

export default function Page() {
  const { t } = useTranslation();
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [tasks, setTasks] = useState(null);
  const session = useSession();
  const { userGoogle } = useAppContext();
  useEffect(() => {
    getTokenGoogle(session.data.user.user.id).then((res) => {
      const config = {
        headers: { Authorization: `Bearer ${res.access_token}` },
      };
      axios
        .get(
          `https://www.googleapis.com/gmail/v1/users/${userGoogle.id}/messages`,
          config
        )
        .then((response) => {
          const messages = response.data.messages;
          let messageHeaders = [];
          messages.forEach((message) => {
            axios
              .get(
                `https://www.googleapis.com/gmail/v1/users/${userGoogle.id}/messages/${message.id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject`,
                config
              )
              .then((messageInfo) => {
                messageHeaders.push(messageInfo.data);
                setTasks(messageHeaders);
              });
          });
        });
    });
  }, []);

  useLayoutEffect(() => {
    if (tasks) {
      const isIndeterminate =
        selectedTasks.length > 0 && selectedTasks.length < tasks.length;
      setChecked(selectedTasks.length === tasks.length);
      setIndeterminate(isIndeterminate);
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedTasks, tasks]);

  function toggleAll() {
    setSelectedTasks(checked || indeterminate ? [] : tasks);
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
                {tasks &&
                  tasks.map((task) => (
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
                        <td>{task.snippet}</td>
                      </td>
                      {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 bg-indigo-100/30">
                    {task.payload.headers[0]}
                    </td> */}
                      {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {task.headers.from}
                    </td> */}
                      {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {task.policy}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className="inline-flex items-center rounded-full bg-green-100/70 px-1.5 py-0.5 text-xs font-medium text-green-700">
                        {task.limitDate}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <div className="h-9 w-9 flex-shrink-0">
                          <Image
                            className="h-9 w-9 rounded-full"
                            width={36}
                            height={36}
                            src={task.createdBy.image}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {task.createdBy.name}
                          </div>
                        </div>
                      </div>
                    </td>
                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <div className="h-9 w-9 flex-shrink-0">
                          <Image
                            width={36}
                            height={36}
                            className="h-9 w-9 rounded-full"
                            src={task.responsiblePerson.image}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {task.responsiblePerson.name}
                          </div>
                        </div>
                      </div>
                    </td> */}
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
