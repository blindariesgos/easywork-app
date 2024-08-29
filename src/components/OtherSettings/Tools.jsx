"use client";
import { Dialog, Transition, Switch } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";

export function Tools() {
  const [enabled, setEnabled] = useState(false);
  return (
    <>
      <div className="bg-white rounded-lg p-5">
        <div className="mr-3 w-full">
          <h1 className="border-b-2 border-black pb-2 w-full">
            Herramientas del menú principal
          </h1>
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
    </>
  );
}
