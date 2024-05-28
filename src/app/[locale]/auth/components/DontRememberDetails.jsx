import React, { useState } from "react";
import Image from "next/image";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { useDataContext } from "../context";
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";

export default function DontRememberDetails() {
  const { contextData, setContextData } = useDataContext();
  const [mode, setMode] = useState(null);
  if (contextData === 3) {
    return (
      <div className="flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="mb-2">
          <Image
            width={156.75}
            height={118.84}
            src={"/img/logo.svg"}
            alt="img"
          />
        </div>
        {/* Titulo */}
        <div className="mb-4">
          <h1>No recuerdo mis datos</h1>
        </div>
        {/* Dato de usuario */}
        <div className="relative text-gray-600 focus-within:text-gray-400">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <button
              type="submit"
              className="p-1 focus:outline-none focus:shadow-outline"
            >
              {/* <UserIcon className="h-5 w-5 text-easywork-main" /> */}
            </button>
          </span>
          <div className="flex justify-between">
            <button
              onClick={() => setMode("email")}
              className="hover:bg-easywork-mainhover bg-easywork-main text-white font-bold py-2 px-4 rounded-md"
            >
              Usar correo
            </button>
            <button
              onClick={() => setMode("cellphone")}
              className="hover:bg-easywork-mainhover bg-easywork-main text-white font-bold py-2 px-4 rounded-md ml-3"
            >
              Usar teléfono
            </button>
          </div>
          {mode === "email" && (
            <div className="relative text-gray-600 focus-within:text-gray-400 mt-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2 top-2">
                  <EnvelopeIcon className="h-6 w-6 text-easywork-main" />
              </span>
              <input
                style={{ border: "none" }}
                type="search"
                name="q"
                className="py-2 text-sm rounded-md pl-10 mt-2 focus:text-gray-900 placeholder-slate-600 w-72"
                placeholder="E-mail"
                autoComplete="off"
              />
            </div>
          )}
          {mode === "cellphone" && (
            <div className="mt-2">
              <IntlTelInput
                containerClassName="intl-tel-input"
                inputClassName="form-control"
                // Aquí puedes agregar más props según tus necesidades
              />
            </div>
          )}
        </div>
        {/* Video guia */}
        <div className="mt-4 w-full flex justify-evenly">
          <button
            onClick={() => setContextData(4)}
            className="hover:bg-easywork-mainhover bg-easywork-main text-white font-bold py-2 px-4 rounded-md"
          >
            Aceptar
          </button>
          <button
            onClick={() => setContextData(0)}
            className="hover:bg-gray-800 bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }
}
