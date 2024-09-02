"use client";
import { Dialog, Transition, Switch } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import SelectInput from "@/src/components/form/SelectInput";

export function Details() {
  const [enabled, setEnabled] = useState(false);
  return (
    <>
      <div className="mr-3 pb-10 w-full h-full overflow-y-auto">
        <div className="bg-white rounded-lg p-5">
          <h1 className="pb-2 w-full">Detalles de la empresa</h1>
          <p className="text-xs">
            Introduzca los datos de su empresa para que se agreguen al CRM. Cree
            una página de destino y utilicela como tarjeta de visita.
          </p>
          <h1 className="mt-2">Detalles de la empresa</h1>
          <p className="mt-3 p-2 text-white text-xs w-full bg-easywork-main">
            Si tiene más de una empresa, puede especificar los datos de cada de
            cada una de ellas por separado. Más información.
          </p>
          <div className="p-3 rounded-md border-2 mt-3">
            <h1>Dirección de agencia</h1>
            <div className="mt-2">
              <div className="flex justify-between text-xs">
                <p className="underline">+506 8312 3456</p>
                <p className="underline">info@tudireccióndeagencia.com</p>
                <p className="underline">www.tudireccióndeagencia.com</p>
              </div>
              <div className="p-2 bg-gray-300 mt-2 text-xs">
                {[
                  { name: "Company Name", action: "Entrar" },
                  { name: "VAT ID", action: "Entrar" },
                  {
                    name: "Address",
                    action: "Curridabat, San José, Costa Rica",
                  },
                  { name: "Bank Name", action: "Entrar" },
                  { name: "Bank Address", action: "Entrar" },
                  { name: "Bank Rounting Number", action: "Entrar" },
                  { name: "Bank Account Holder Name", action: "Entrar" },
                  { name: "Bank Account Number", action: "Entrar" },
                  { name: "IBAN", action: "Entrar" },
                  { name: "SWIFT", action: "Entrar" },
                  { name: "BIC", action: "Entrar" },
                ].map((item, index) => (
                  <div className="flex w-full mb-2" key={index}>
                    <p className="w-1/2">{item.name}</p>
                    <p className="w-1/2 underline">{item.action}</p>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-center">
                <button className="ml-2 px-2 py-1.5 rounded-md bg-gray-50 hover:bg-gray-400 text-white">
                  Crear página de destino
                </button>
              </div>
            </div>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <div className="flex">
              <button className="p-2 rounded-md bg-easywork-main hover:bg-easywork-mainhover text-white">
                Guardar
              </button>
              <button className="ml-2 p-2 rounded-md bg-gray-50 hover:bg-gray-400 text-white">
                Cancelar
              </button>
            </div>
            <p className="text-sm">Agregar empresa</p>
          </div>
        </div>
      </div>
    </>
  );
}
