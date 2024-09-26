"use client";
import React, { useCallback, useState } from "react";
import Image from "next/image";
import { EnvelopeIcon, UserIcon } from "@heroicons/react/24/solid";
import { useDataContext } from "../context";
import { getDataPassword } from "../../../../lib/apis";
import { sendOtpEmail } from "@/src/lib/api/hooks/auths";

export default function GetPassword() {
  const { contextData, setContextData } = useDataContext();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSendOtp = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await sendOtpEmail(email);
      setContextData(4);
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [email, setContextData]);

  function sendData() {
    setContextData(2);
    // getDataPassword(email)
    // .then(data => {
    //   console.log(data);
    // })
  }

  if (contextData === 1) {
    return (
      <div className="flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="mb-2">
          <Image
            width={156.75}
            height={118.84}
            src={"/img/logo.svg"}
            alt="easywork"
          />
        </div>
        <div className="mb-4">
          <h1>Obtener contraseña</h1>
        </div>
        {/* E-mail */}
        <div className="relative text-gray-600 focus-within:text-gray-400 mt-2">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <button
              type="submit"
              className="p-1 focus:outline-none focus:shadow-outline"
            >
              <EnvelopeIcon className="h-5 w-5 text-easywork-main" />
            </button>
          </span>
          <input
            style={{ border: "none" }}
            type="search"
            name="q"
            onChange={(e) => setEmail(e.target.value)}
            className="py-2 text-sm rounded-md pl-10 focus:text-gray-900 placeholder-slate-600"
            placeholder="E-mail"
            autoComplete="off"
          />
        </div>
        {/* info */}
        <div style={{ width: 320 }} className="text-xs my-4 w-1/4">
          <p className="text-center">
            Si ha olvidado su contraseña, introduzca su dirección de correo
            electrónico. La información de la cuenta será enviada a usted por
            correo electrónico junto con un código para restablecer su
            contraseña.
          </p>
        </div>
        {/* boton */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => handleSendOtp()}
            style={{ backgroundColor: "#262261" }}
            className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Restablecer mi contraseña
          </button>
          <button
            onClick={() => setContextData(0)}
            className="hover:bg-gray-800 bg-gray-700 w-24 mt-2 text-white font-bold py-2 px-4 rounded-md"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }
}
