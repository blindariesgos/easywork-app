"use client";
import React from "react";
import Image from "next/image";
import { DialogSuccess } from "./DialogSuccess";
import { useState } from "react";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { useDataContext } from "../context";
import { toast } from 'react-toastify';

export default function ChangePassword() {
  const { contextData, setContextData } = useDataContext();
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  function validatePassword(password) {
    if (password.length < 7) {
      return "La contraseña debe tener al menos 7 caracteres";
    }
    if (!/[A-Z]/.test(password)) {
      return "La contraseña debe contener al menos una letra mayúscula";
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return "La contraseña debe contener al menos un caracter especial (!@#$%^&*)";
    }
    return "";
  }

  function sendData() {
    const newPasswordError = validatePassword(newPassword);
    const repeatPasswordError = validatePassword(repeatPassword);
    if (newPasswordError) {
      toast.error(newPasswordError);
      return;
    }
    if (repeatPasswordError) {
      toast.error(repeatPasswordError);
      return;
    }
    if (newPassword !== repeatPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    setIsOpen(true);
    // getDataPassword(email)
    // .then(data => {
    //   console.log(data);
    // })
  }
  if (contextData === 2) {
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
        <div className="mb-4">
          <h1>Cambiar contraseña</h1>
        </div>
        {/* Usuario */}
        <div className="relative text-gray-600 focus-within:text-gray-400">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <button
              type="submit"
              className="p-1 focus:outline-none focus:shadow-outline"
            >
              <LockClosedIcon className="h-5 w-5 text-easywork-main" />
            </button>
          </span>
          <input
            style={{ border: "none" }}
            type="password"
            name="q"
            className="py-2 text-sm rounded-md pl-10 focus:text-gray-900 placeholder-slate-600"
            placeholder="Contraseña nueva"
            autoComplete="off"
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        {/* E-mail */}
        <div className="relative text-gray-600 focus-within:text-gray-400 mt-2">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <button
              type="submit"
              className="p-1 focus:outline-none focus:shadow-outline"
            >
              <LockClosedIcon className="h-5 w-5 text-easywork-main" />
            </button>
          </span>
          <input
            style={{ border: "none" }}
            type="password"
            name="q"
            className="py-2 text-sm rounded-md pl-10 focus:text-gray-900 placeholder-slate-600"
            placeholder="Repetir contraseña"
            autoComplete="off"
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
        </div>
        {/* info */}
        <div style={{ width: 320 }} className="text-xs my-4 w-1/4">
          <p className="text-center">
            Si ha olvidado su contraseña, introduzca su dirección de correo
            electrónico o login que usaba para acceder. La información de acceso
            a su cuenta será enviada a la dirección de correo suministrada,
            junto con un código para reestablecer su contraseña.
          </p>
        </div>
        <DialogSuccess isOpen={isOpen}>
          <div>
            <button
              onClick={() => sendData()}
              style={{ backgroundColor: "#262261" }}
              className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
            >
              Restablecer mi contraseña
            </button>
          </div>
        </DialogSuccess>
      </div>
    );
  }
}
