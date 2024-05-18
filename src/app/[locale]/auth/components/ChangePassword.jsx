'use client';
import React from "react";
import Image from "next/image";
import { DialogSuccess } from "./DialogSuccess"
import { useState } from 'react'
import { LockClosedIcon } from '@heroicons/react/24/solid';
import { useDataContext } from "../context";
export default function ChangePassword() {
    const { contextData, setContextData } = useDataContext();
    const [isOpen, setIsOpen] = useState(false)
    function sendData() {
        setContextData(0);
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
                        <button type="submit" className="p-1 focus:outline-none focus:shadow-outline">
                            <LockClosedIcon className="h-5 w-5 text-easywork-main" />
                        </button>
                    </span>
                    <input style={{ border: 'none' }} type="password" name="q" className="py-2 text-sm rounded-md pl-10 focus:text-gray-900 placeholder-slate-600" placeholder="Contraseña nueva" autoComplete="off" />
                </div>
                {/* E-mail */}
                <div className="relative text-gray-600 focus-within:text-gray-400 mt-2">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <button type="submit" className="p-1 focus:outline-none focus:shadow-outline">
                            <LockClosedIcon className="h-5 w-5 text-easywork-main" />
                        </button>
                    </span>
                    <input style={{ border: 'none' }} type="password" name="q" className="py-2 text-sm rounded-md pl-10 focus:text-gray-900 placeholder-slate-600" placeholder="Repetir contraseña" autoComplete="off" />
                </div>
                {/* info */}
                <div style={{ width: 320 }} className="text-xs my-4 w-1/4">
                    <p className="text-center">
                        Si ha olvidado su contraseña, introduzca sus dirección de correo electrónico o el inicio de sesión.
                        La información de la cuenta será enviada a usted por correo electrónico junto con un código para restablecer su contraseña. Gracias.
                    </p>
                </div>
                <DialogSuccess />
            </div>
        )
    }
}
