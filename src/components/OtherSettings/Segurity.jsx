"use client";
import { Dialog, Transition, Switch } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import SelectInput from "@/src/components/form/SelectInput";

export function Segurity() {
  const [enabled, setEnabled] = useState(false);
  return (
    <>
      <div className="mr-3 pb-10 w-full h-full overflow-y-auto">
        <div className="bg-white rounded-lg p-5">
          <h1 className="pb-2 w-full">Seguridad</h1>
          <p className="pb-2 text-sm">
            Haga que las cuentas de los usuarios sean más seguras para evitar
            accesos no autorizados.
          </p>
          <div className="p-3 border-2">
            <h1>Autenticación de dos factores</h1>
          </div>
          <div className="p-3 border-2 mt-2 rounded-md">
            <h1>Historial de acceso</h1>
          </div>
          <div className="p-3 border-2 mt-2 rounded-md">
            <h1>Registro de eventos</h1>
          </div>
          <div className="p-3 border-2 mt-2 rounded-md">
            <h1>Restringir el acceso por dirección IP</h1>
          </div>
          <div className="p-3 border-2 mt-2 rounded-md">
            <h1>Lista negra</h1>
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
