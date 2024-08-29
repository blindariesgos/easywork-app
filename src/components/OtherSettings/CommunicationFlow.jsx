"use client";
import { Dialog, Transition, Switch } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";

export function CommunicationFlow() {
  const [enabled, setEnabled] = useState(false);
  return (
    <>
      <div className="bg-white rounded-lg p-5">
        <div className="mr-3 w-full">
          <h1 className="pb-2 w-full">Flujo de comunicación</h1>
          <div className="flex mt-4 items-center">
            <Switch
              checked={enabled}
              onChange={setEnabled}
              className="group relative flex h-5 w-12 cursor-pointer rounded-full bg-zinc-300 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-indigo-300"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-indigo-600 ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
              />
            </Switch>
            <p className="ml-2 w-full">
              Todos los empleados pueden publicar en el feed
            </p>
          </div>
        </div>
        <p className="text-gray-50 text-sm">
          La difusión de mensajes está permitida en el feed. Estas publicaciones
          serán visibles para todos.
        </p>
        <div>
          <p className="text-xs text-gray-50 mt-3">
            Usuarios autorizados para enviar mensajes de difusión en el feed
          </p>
          <div className="flex py-3 w-48 border-2 rounded-md"></div>
        </div>
        <div className="flex mt-4 items-center">
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className="group relative flex h-5 w-12 cursor-pointer rounded-full bg-zinc-300 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-indigo-300"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-indigo-600 ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
            />
          </Switch>
          <p className="ml-2 w-full">
            Agregar a todos los empleados como destinatarios predeterminados
            (difusión)
          </p>
        </div>
        <p className="text-gray-50 text-sm">
          Las nuevas entradas en el feed tendrán a todos los usuarios como
          destinatarios
        </p>
        <div className="flex items-center">
          <div className="w-7/12 pr-3">
            <p className="text-xs">Texto del botón/enlace Me gusta:</p>
            <input
              type="text"
              placeholder="Like"
              className="mt-1 w-full h-7 border-2 border-black rounded-md"
            />
          </div>
          <div className="w-5/12 pl-3 border-l-2 text-sm">
            <p>Ejemplo de me gusta</p>
            <p className="text-blue-400">Like</p>
            <p className="text-blue-600 mt-2">Usted y 24 personas mas</p>
          </div>
        </div>
      </div>
      <div className="w-full p-3 mt-2 rounded-md flex items-center bg-gray-500 cursor-pointer">Chats</div>
    </>
  );
}
