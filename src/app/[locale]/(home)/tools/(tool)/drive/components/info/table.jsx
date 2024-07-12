"use client";
import { getFileIcon } from "../../../../../../../../lib/drive_helper";
import clsx from "clsx";
import Image from "next/image";
import { useLayoutEffect, useRef, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon, Bars3Icon } from "@heroicons/react/20/solid";
import { Menu, Transition, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Button from "@/src/components/form/Button";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TableInfo({
  files,
  selectedFiles,
  checkbox,
  shareOptions,
  itemOptions,
  toggleAll,
  setSelectedFiles,
  checked,
}) {
  const { t } = useTranslation();

  return (
    <div className="">
      <div className="mt-8 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              {selectedFiles.length > 0 && (
                <div className="flex h-12 items-center space-x-3 bg-white px-2">
                  <button
                    type="button"
                    className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                  >
                    {t("tools:drive:table:delete")}
                  </button>
                </div>
              )}
              <div className="w-full overflow-x-auto">
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
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        {t("tools:drive:table:link-to")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {files.map((file) => (
                      <tr
                        key={file.name}
                        className={clsx(
                          {
                            "bg-zinc-100": selectedFiles.includes(file)
                          },
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
                              className="hover:bg-slate-50/30 w-10 md:w-auto py-2 px-1 rounded-lg"
                            >
                              <MenuButton className="-m-1.5 flex items-center p-1.5">
                                <Bars3Icon
                                  className="ml-3 h-5 w-5 text-gray-400"
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
                                <MenuItems anchor="right start" className="rounded-md bg-white py-2 shadow-lg focus:outline-none">
                                  {itemOptions.map((item) => (
                                    <MenuItem key={item.name}>
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
                                            <Menu>
                                              <MenuButton className="flex items-center">
                                                <div className="w-full flex items-center justify-between">
                                                  {item.name}
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
                                                <MenuItems anchor={{ to: 'right start', gap: '12px' }} className="rounded-md bg-white py-2 shadow-lg focus:outline-none">
                                                  {shareOptions.map((item) => (
                                                    <MenuItem key={item.name}>
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
                                                    </MenuItem>
                                                  ))}
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
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                          <Button
                            label="CMR"
                            buttonStyle="secondary"
                            className="px-2 py-1"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-white w-full h-10">
                    <tr>
                      <td></td>
                      <div className="ml-6">Seleccionado: {selectedFiles.length}/{files.length}</div>
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
    </div>
  );
}
