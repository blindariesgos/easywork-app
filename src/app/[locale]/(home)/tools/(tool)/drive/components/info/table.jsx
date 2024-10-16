"use client";
import { getFileIcon, getFileSize } from "@/src/lib/drive_helper";
import clsx from "clsx";
import Image from "next/image";
import { useLayoutEffect, useRef, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon, Bars3Icon } from "@heroicons/react/20/solid";
import {
  Menu,
  Transition,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import Button from "@/src/components/form/Button";
import { formatDate } from "@/src/utils/getFormatDate";
import UserInfoById from "../UserInfoById";
import { useRouter } from "next/navigation";
import ConnectCRMBUtton from "../ConnectCRMButton";
import ConnectCRM from "../dialogs/ConnectCRM";

export default function TableInfo({
  files,
  selectedFiles,
  checkbox,
  shareOptions,
  itemOptions,
  toggleAll,
  setSelectedFiles,
  checked,
  handleOpenItem,
}) {
  const { t } = useTranslation();
  const { push } = useRouter();
  return (
    <div className="flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
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
                      {t("tools:drive:table:created-by")}
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
                  {files &&
                    files.map((file) => (
                      <tr
                        key={file.id}
                        className={clsx(
                          {
                            "bg-zinc-100": selectedFiles.includes(file.id),
                          },
                          "hover:bg-zinc-100"
                        )}
                      >
                        <td className="relative px-7 h-full">
                          <div className="flex h-full items-center">
                            {selectedFiles.includes(file.id) && (
                              <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                            )}
                            <input
                              type="checkbox"
                              className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              value={file.name}
                              checked={selectedFiles.includes(file.id)}
                              onChange={(e) =>
                                setSelectedFiles(
                                  e.target.checked
                                    ? [...selectedFiles, file.id]
                                    : selectedFiles.filter(
                                        (fileId) => fileId !== file.id
                                      )
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
                                <MenuItems
                                  anchor="right start"
                                  className="rounded-md bg-white py-2 shadow-lg focus:outline-none"
                                >
                                  {itemOptions.map((item) => (
                                    <MenuItem
                                      key={item.name}
                                      onClick={() =>
                                        item.onClick && item.onClick(file)
                                      }
                                      disabled={item.disabled}
                                    >
                                      {({ active, disabled }) => (
                                        <div
                                          className={clsx(
                                            "block px-3 py-1 text-sm leading-6  ",
                                            {
                                              "bg-gray-50": active,
                                              "cursor-pointer text-black":
                                                !disabled,
                                              "cursor-no-drop text-gray-600":
                                                disabled,
                                            }
                                          )}
                                        >
                                          {item.name !== "Compartir" ||
                                          item.disabled ? (
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
                                                <MenuItems
                                                  anchor={{
                                                    to: "right start",
                                                    gap: "12px",
                                                  }}
                                                  className="rounded-md bg-white py-2 shadow-lg focus:outline-none"
                                                >
                                                  {shareOptions.map((item) => (
                                                    <MenuItem key={item.name}>
                                                      {({ active }) => (
                                                        <div
                                                          className={clsx(
                                                            "block px-3 py-1 text-sm leading-6 text-black cursor-pointer",
                                                            {
                                                              "bg-gray-50":
                                                                active,
                                                            }
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
                              {getFileIcon(file, "h-11 w-11 text-indigo-800")}
                            </div>
                            <div className="ml-4">
                              <div
                                className="font-medium text-gray-900 cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis max-w-[220px]"
                                onClick={() => handleOpenItem(file)}
                                title={file.name}
                              >
                                {file?.metadata?.observableName ?? file.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                          <p className="text-center">
                            {formatDate(file.updatedat, "dd/MM/yyyy")}
                          </p>
                          <p className="text-center">
                            {formatDate(file.updatedat, "hh:mm a")}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                          <div className="flex items-center justify-center">
                            {/* <div className="h-9 w-9 flex-shrink-0">
                              <Image
                                className="h-9 w-9 rounded-full"
                                width={36}
                                height={36}
                                src={file.modifiedBy.image}
                                alt=""
                              />
                            </div> */}
                            <div className="ml-4">
                              <div className="font-medium text-gray-900 text-center">
                                {file?.modifiedBy?.name ?? "N/P"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700 text-center">
                          <div className="flex items-center">
                            {/* <div className="h-9 w-9 flex-shrink-0">
                              <Image
                                className="h-9 w-9 rounded-full"
                                width={36}
                                height={36}
                                src={file.modifiedBy.image}
                                alt=""
                              />
                            </div> */}
                            <UserInfoById id={file?.createdby} />
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700 text-center">
                          {getFileSize(file.size) ?? ""}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                          {file?.owners &&
                          file?.owners?.find(
                            (f) => f.entityType === "contact"
                          ) ? (
                            <Button
                              label="CRM"
                              buttonStyle="secondary"
                              className="px-2 py-1"
                              onclick={() =>
                                push(
                                  `/sales/crm/contacts/contact/${
                                    file?.owners?.find(
                                      (f) => f.entityType === "contact"
                                    )?.entityId
                                  }?show=true&page=1`
                                )
                              }
                            />
                          ) : (
                            file.type === "folder" && (
                              <ConnectCRMBUtton folder={file} />
                            )
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ConnectCRM />
    </div>
  );
}
