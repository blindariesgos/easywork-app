"use client";
import { getFileIcon } from "../../../../../../../lib/drive_helper";
import clsx from "clsx";
import Image from "next/image";
import { useLayoutEffect, useRef, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon, Bars3Icon } from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const files = [
  {
    name: "Lindsay Walton",
    modifiedAt: "26/01/2024",
    modifiedBy: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    size: "10 MB",
    mimetype: "folder",
  },
  {
    name: "Proyecto Easy",
    modifiedAt: "26/01/2024",
    modifiedBy: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    size: "1 MB",
    mimetype: "document",
  },
  {
    name: "Nuevo documento 1",
    modifiedAt: "23/01/2024",
    modifiedBy: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    size: "14 KB",
    mimetype: "document",
  },
  {
    name: "Curriculum",
    modifiedAt: "23/01/2024",
    modifiedBy: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    size: "512 KB",
    mimetype: "pdf",
  },
  // More files...
];

export default function Page() {
  const { t } = useTranslation();
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedFiles.length > 0 && selectedFiles.length < files.length;
    setChecked(selectedFiles.length === files.length);
    setIndeterminate(isIndeterminate);
    checkbox.current.indeterminate = isIndeterminate;
  }, [selectedFiles]);

  function toggleAll() {
    setSelectedFiles(checked || indeterminate ? [] : files);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  const itemOptions = [
    { name: "Abrir" },
    { name: "Compartir" },
    { name: "Renombrar" },
    { name: "Copiar" },
  ];

  const shareOptions = [
    { name: "Compartir enlace interno" },
    { name: "Compartir con otros usuarios" },
  ];

  return (
    <div className="">
      <div className="mt-8 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              {selectedFiles.length > 0 && (
                <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white sm:left-12">
                  <button
                    type="button"
                    className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                  >
                    {t("tools:drive:table:edit")}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                  >
                    {t("tools:drive:table:delete")}
                  </button>
                </div>
              )}
              <table className="min-w-full divide-y divide-gray-300 table-auto">
                <thead className="bg-white">
                  <tr>
                    <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </th>
                    <th
                      scope="col"
                      className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                    >
                      {t("tools:drive:table:name")}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      {t("tools:drive:table:modified")}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      {t("tools:drive:table:modified-by")}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      {t("tools:drive:table:size")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {files.map((file) => (
                    <tr
                      key={file.name}
                      className={clsx(
                        selectedFiles.includes(file) ? "bg-gray-50" : undefined,
                        "hover:bg-zinc-100"
                      )}
                    >
                      <td className="relative px-7 h-full">
                        <div className="flex h-full items-center">
                          {selectedFiles.includes(file) && (
                            <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                          )}
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            value={file.email}
                            checked={selectedFiles.includes(file)}
                            onChange={(e) =>
                              setSelectedFiles(
                                e.target.checked
                                  ? [...selectedFiles, file]
                                  : selectedFiles.filter((p) => p !== file)
                              )
                            }
                          />
                          <Menu
                            as="div"
                            className="relative hover:bg-slate-50/30 w-10 md:w-auto py-2 px-1 rounded-lg"
                          >
                            <Menu.Button className="-m-1.5 flex items-center p-1.5">
                              <Bars3Icon
                                className="ml-3 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </Menu.Button>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute left-0 z-50 mt-2.5 w-40 rounded-md bg-white py-2 shadow-lg focus:outline-none">
                                {itemOptions.map((item) => (
                                  <Menu.Item key={item.name}>
                                    {({ active }) => (
                                      <div
                                        className={classNames(
                                          active ? "bg-gray-50" : "",
                                          "block px-3 py-1 text-sm leading-6 text-black cursor-pointer"
                                        )}
                                      >
                                        {item.name !== "Compartir" ? (
                                          item.name
                                        ) : (
                                          <Menu
                                            as="div"
                                            className="relative inline-block text-left"
                                          >
                                            <Menu.Button className="-m-1.5 flex items-center p-1.5">
                                              <div className="w-full flex items-center justify-between">
                                                {item.name}
                                                <ChevronRightIcon className="h-6 w-6 ml-14" />
                                              </div>
                                            </Menu.Button>
                                            <Transition
                                              as={Fragment}
                                              enter="transition ease-out duration-100"
                                              enterFrom="transform opacity-0 scale-95"
                                              enterTo="transform opacity-100 scale-100"
                                              leave="transition ease-in duration-75"
                                              leaveFrom="transform opacity-100 scale-100"
                                              leaveTo="transform opacity-0 scale-95"
                                            >
                                              <Menu.Items className="absolute left-32 z-50 mt-2.5 w-56 rounded-md bg-white py-2 shadow-lg focus:outline-none">
                                                {shareOptions.map((item) => (
                                                  <Menu.Item key={item.name}>
                                                    {({ active }) => (
                                                      <div
                                                        className={classNames(
                                                          active
                                                            ? "bg-gray-50"
                                                            : "",
                                                          "block px-3 py-1 text-sm leading-6 text-black cursor-pointer"
                                                        )}
                                                      >
                                                        {item.name}
                                                      </div>
                                                    )}
                                                  </Menu.Item>
                                                ))}
                                              </Menu.Items>
                                            </Transition>
                                          </Menu>
                                        )}
                                      </div>
                                    )}
                                  </Menu.Item>
                                ))}
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      </td>
                      <td
                        className={clsx(
                          "whitespace-nowrap py-4 pr-3 text-sm font-medium",
                          selectedFiles.includes(file)
                            ? "text-indigo-600"
                            : "text-gray-900"
                        )}
                      >
                        <div className="flex items-center">
                          <div className="h-11 w-11 flex-shrink-0">
                            {getFileIcon(
                              file.mimetype,
                              "h-11 w-11 text-indigo-800"
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900 cursor-pointer hover:underline">
                              {file.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {file.modifiedAt}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        <div className="flex items-center">
                          <div className="h-9 w-9 flex-shrink-0">
                            <Image
                              className="h-9 w-9 rounded-full"
                              width={36}
                              height={36}
                              src={file.modifiedBy.image}
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {file.modifiedBy.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {file.size}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-white w-full h-10">
                  <tr>
                    <td></td>
                    <td>Seleccionado: 0/50</td>
                    <td>Pagina 1/2</td>
                    <td>
                      <div className="flex items-center ">
                        <div className="flex">
                          <ChevronLeftIcon className="h-6 w-6 mr-2 text-easywork-main" />
                          anterior
                        </div>
                        <div className="ml-4 flex">
                          siguiente
                          <ChevronRightIcon className="h-6 w-6 ml-2 text-easywork-main" />
                        </div>
                      </div>
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
