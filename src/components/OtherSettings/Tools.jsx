"use client";
import { Dialog, Transition, Switch } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { WrenchIcon } from "@heroicons/react/24/outline";

export function Tools() {
  const [enabled, setEnabled] = useState(false);
  return (
    <>
      <h1 className="ml-3 mb-3 text-lg">Herramientas</h1>
      <div className="mr-3 pb-10 w-full h-full overflow-y-auto">
        <div className="bg-white rounded-lg p-5">
          <div className="mr-3 w-full">
            <div className="flex border-b-2 border-black w-full">
              <WrenchIcon className="h-5 w-5" />
              <h1 className="pb-2 ml-1">
                Herramientas del menú principal
              </h1>
            </div>
            <p className="mt-3 p-2 text-white text-xs w-full bg-easywork-main">
              Seleccione las herramientas que utilizará en su Easywork
            </p>
            <div className="pb-4 mt-3">
              {[
                "Flujo de comunicación",
                "Tareas",
                "CRM",
                "Sitios web",
                "Firma electrónica",
                "Compañía",
                "Automatización",
              ].map((text, index) => (
                <div
                  key={index}
                  className="flex justify-between p-2 mb-2 w-full border-2 rounded-md border-easywork-main"
                >
                  <div className="flex">
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
                    <p className="ml-2">{text}</p>
                  </div>
                  {index !== 0 && index !== 4 && (
                    <p className="p-0.5 border-2 border-gray-50 text-gray-50 text-xs">
                      Abrir
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
