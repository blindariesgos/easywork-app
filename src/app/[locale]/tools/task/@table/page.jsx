"use client";
import clsx from "clsx";
import Image from "next/image";
import React, { useLayoutEffect, useRef, useState } from "react";
const tasks = [
  {
    id: 1,
    name: "Correo Ventas del mes de agosto",
    activity: "Enero, 28 05:40 pm",
    contact: "No especificado",
    policy: "No especificado",
    limitDate: "26/01/2024",
    createdBy: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    responsiblePerson: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  },
  {
    id: 1,
    name: "Correo Ventas del mes de septiembre",
    activity: "Enero, 28 10:40 am",
    contact: "No especificado",
    policy: "No especificado",
    limitDate: "28/01/2024",
    createdBy: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },

    responsiblePerson: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  },
  {
    id: 1,
    name: "Actualizar póliza de seguro",
    activity: "Enero, 29 09:40 am",
    contact: "No especificado",
    policy: "No especificado",
    limitDate: "30/01/2024",
    createdBy: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    responsiblePerson: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  },
  // More tasks...
];

export default function Page() {
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedTasks.length > 0 && selectedTasks.length < tasks.length;
    setChecked(selectedTasks.length === tasks.length);
    setIndeterminate(isIndeterminate);
    checkbox.current.indeterminate = isIndeterminate;
  }, [selectedTasks]);

  function toggleAll() {
    setSelectedTasks(checked || indeterminate ? [] : tasks);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  return (
    <div className="flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="relative overflow-hidden   sm:rounded-lg">
            {selectedTasks.length > 0 && (
              <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white sm:left-12">
                <button
                  type="button"
                  className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                >
                  Eliminar
                </button>
              </div>
            )}
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-white mb-2">
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
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 bg-indigo-100/30"
                  >
                    Actividad
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Contacto
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Póliza
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Fecha Límite
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Creado Por
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Persona Responsable
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className={clsx(
                      selectedTasks.includes(task) ? "bg-gray-50" : undefined,
                      "hover:bg-indigo-100/40 cursor-default"
                    )}
                  >
                    <td className="relative px-7 sm:w-12 sm:px-6">
                      {selectedTasks.includes(task) && (
                        <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                      )}
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
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
                      {task.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 bg-indigo-100/30">
                      {task.activity}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {task.contact}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
