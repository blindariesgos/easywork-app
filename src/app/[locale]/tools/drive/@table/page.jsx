"use client";
import { getFileIcon } from "@/lib/drive_helper";
import clsx from "clsx";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

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

  return (
    <div className="">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              {selectedFiles.length > 0 && (
                <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white sm:left-12">
                  <button
                    type="button"
                    className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                  >
                    Bulk edit
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                  >
                    Delete all
                  </button>
                </div>
              )}
              <table className="min-w-full table-fixed divide-y divide-gray-300">
                <thead className="bg-gray-50">
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
                      Nombre
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Modificado
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Modificado por
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Tamaño
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
                      <td className="relative px-7 sm:w-12 sm:px-6">
                        {selectedFiles.includes(file) && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
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
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {file.modifiedAt}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {file.size}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
