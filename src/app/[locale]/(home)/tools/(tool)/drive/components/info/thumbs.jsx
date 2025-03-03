"use client";
import React, { Fragment } from "react";
import { ChevronRightIcon, Bars3Icon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import {
  Menu,
  Transition,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import clsx from "clsx";
import { getFileIcon } from "../../../../../../../../lib/drive_helper";

export default function ThumbsInfo({
  files,
  selectedFiles,
  shareOptions,
  itemOptions,
  setSelectedFiles,
  handleOpenItem,
}) {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <div className="bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-5">
        {files &&
          files.map((file) => (
            <div
              key={file.name}
              className={clsx(
                "relative rounded-lg flex flex-col bg-[#E9E9E9] p-3 w-full",
                {
                  "border-2 border-primary": selectedFiles.includes(file.id),
                }
              )}
            >
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  value={file.email}
                  checked={selectedFiles.includes(file.id)}
                  onChange={(e) =>
                    setSelectedFiles(
                      e.target.checked
                        ? [...selectedFiles, file.id]
                        : selectedFiles.filter((p) => p !== file.id)
                    )
                  }
                />
                <Menu>
                  <MenuButton className="flex items-center">
                    <Bars3Icon
                      className="h-5 w-5 text-gray-400"
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
                          onClick={() => item.onClick && item.onClick(file)}
                          disabled={item.disabled}
                        >
                          {({ active }) => (
                            <div
                              className={clsx(
                                active ? "bg-gray-50 text-white" : "text-black",
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
                                    <MenuItems
                                      anchor={{
                                        to: "right start",
                                        gap: "12px",
                                      }}
                                      className="rounded-md bg-white py-2 shadow-lg focus:outline-none"
                                    >
                                      {shareOptions.map((subItem) => (
                                        <MenuItem key={subItem.name}>
                                          {({ active }) => (
                                            <div
                                              className={clsx(
                                                active ? "bg-gray-50" : "",
                                                "block px-3 py-1 text-sm leading-6 text-black cursor-pointer"
                                              )}
                                            >
                                              {subItem.name}
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
              <div className="flex flex-col items-center justify-center">
                {getFileIcon(file, "h-12 w-12 text-indigo-800")}
              </div>
              <p
                className="text-xs overflow-hidden whitespace-nowrap text-ellipsis w-full pt-4 cursor-pointer"
                title={file.name}
                onClick={() => handleOpenItem(file)}
              >
                {file?.metadata?.observableName ?? file.name}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
