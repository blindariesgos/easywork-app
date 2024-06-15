"use client";
import React, { useState, useLayoutEffect, useRef, Fragment } from "react";
import { FolderIcon } from "@heroicons/react/20/solid";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon, Bars3Icon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import { Menu, Transition } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Page() {
  const { t } = useTranslation();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedFiles.length > 0 && selectedFiles.length < 9;
    setChecked(selectedFiles.length === 9);
    setIndeterminate(isIndeterminate);
    if (checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedFiles]);

  function toggleAll() {
    setSelectedFiles(
      checked || indeterminate ? [] : Array.from({ length: 9 }, (_, i) => i)
    );
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
    <div className="relative">
      {selectedFiles.length > 0 && (
        <div className="absolute left-2 top-0 flex h-12 items-center space-x-3 bg-white">
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
      <div className="bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="relative min-w-48 w-full sm:w-1/2 md:w-1/3 min-h-32 h-40 rounded-md flex justify-center items-center"
          >
            <input
              type="checkbox"
              className="absolute right-1 bottom-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              value={index}
              checked={selectedFiles.includes(index)}
              onChange={(e) =>
                setSelectedFiles(
                  e.target.checked
                    ? [...selectedFiles, index]
                    : selectedFiles.filter((p) => p !== index)
                )
              }
            />
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="-m-1.5 flex items-center p-1.5">
                <Bars3Icon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
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
                <Menu.Items className="absolute right-0 bottom-0 z-50 mt-2.5 w-40 rounded-md bg-white py-2 shadow-lg focus:outline-none">
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
                            <Menu as="div" className="relative inline-block text-left">
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
                                <Menu.Items className="absolute right-0 bottom-0 z-50 mt-2.5 w-56 rounded-md bg-white py-2 shadow-lg focus:outline-none">
                                  {shareOptions.map((item) => (
                                    <Menu.Item key={item.name}>
                                      {({ active }) => (
                                        <div
                                          className={classNames(
                                            active ? "bg-gray-50" : "",
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
            <div className="flex flex-col items-center justify-center">
              <FolderIcon className="h-24 w-24 text-easywork-main" />
              <p>Carpeta de tal cosa</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex bg-white w-full pb-2">
        <div className="ml-6">Seleccionado: {selectedFiles.length}/50</div>
        <div className="ml-6">Pagina 1/2</div>
        <div className="ml-6">
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
        </div>
      </div>
    </div>
  );
}

