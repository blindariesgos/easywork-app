"use client";
import { Dialog, Transition, Switch } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import {
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export function Rgpd() {
  const [enabled, setEnabled] = useState(false);
  return (
    <>
      <div className="mr-3 pb-10 w-full h-full overflow-y-auto">
        <div className="bg-white rounded-lg p-5">
          <h1 className="pb-2 w-full">Cumplimiento de RGPD</h1>
          <p className="pb-2 text-sm">
            EasyWork cumple con el Reglamento General de Protección de Datos
            (RGPD)
          </p>
          <div className="border-2 p-2 rounded-md">
            <div className="flex w-full pb-2">
            <DocumentTextIcon className="h-5 w-5" />
            <h1 className="ml-1">Cumplimiento de RGPD</h1>
            </div>            
            <p className="p-2 mb-2 text-white text-xs w-full bg-easywork-main">
              Los detalles sobre el cumplimiento del RGPD están disponibles.
              <br />
              <b className="underline">Más información</b>
              <br />
              <b className="underline">
                Ver el Acuerdo de Procesamiento de Datos
              </b>
            </p>
            <div className="w-full">
              <p className="text-xs ml-2">Nombre de la empresa</p>
              <input
                type="text"
                placeholder="Mi empresa"
                className="rounded-md h-9 text-sm w-full"
              />
            </div>
            <div className="w-full mt-2">
              <p className="text-xs ml-2">Marcos Vizcaino</p>
              <input
                type="text"
                placeholder="Mi empresa"
                className="rounded-md h-9 text-sm w-full"
              />
            </div>
            <div className="w-full mt-2">
              <p className="text-xs ml-2">info@tudireccióndeagencias.com</p>
              <input
                type="text"
                placeholder="Mi empresa"
                className="rounded-md h-9 text-sm w-full"
              />
            </div>
            <div className="w-full mt-2">
              <p className="text-xs ml-2">Fecha</p>
              <input
                type="text"
                placeholder="Elegir fecha"
                className="rounded-md h-9 text-sm w-full"
              />
            </div>
            <div className="mt-3 flex justify-end text-sm">
              <p className="underline">RGDP para empleados</p>
              <p className="underline ml-2">RGDP para CRM</p>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <p className="underline ml-2 text-sm">Agregar empresa</p>
          </div>
          <div className="flex mt-2">
            <button className="p-2 rounded-md bg-easywork-main hover:bg-easywork-mainhover text-white">
              Guardar
            </button>
            <button className="ml-2 p-2 rounded-md bg-gray-50 hover:bg-gray-400 text-white">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
