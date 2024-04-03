import React from "react";
import Image from "next/image";
import { EnvelopeIcon, UserIcon } from '@heroicons/react/24/solid';
export default function getPassword() {
    return (
        <div className="flex flex-col items-center justify-center">
            {/* Logo */}
            <div className="mb-2">
                <Image
                    width={156.75}
                    height={118.84}
                    src={"/img/logo.svg"}
                />
            </div>
            <div className="mb-4">
                <h1>Obtener contraseña</h1>
            </div>
            {/* Usuario */}
            <div className="relative text-gray-600 focus-within:text-gray-400">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <button type="submit" className="p-1 focus:outline-none focus:shadow-outline">
                        <UserIcon className="h-5 w-5 text-easywork-main" />
                    </button>
                </span>
                <input style={{ border: 'none' }} type="search" name="q" className="py-2 text-sm rounded-md pl-10 focus:text-gray-900" placeholder="Usuario" autocomplete="off" />
            </div>
            {/* E-mail */}
            <div className="relative text-gray-600 focus-within:text-gray-400 mt-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <button type="submit" className="p-1 focus:outline-none focus:shadow-outline">
                        <EnvelopeIcon className="h-5 w-5 text-easywork-main" />
                    </button>
                </span>
                <input style={{ border: 'none' }} type="search" name="q" className="py-2 text-sm rounded-md pl-10 focus:text-gray-900" placeholder="E-mail" autocomplete="off" />
            </div>
            {/* info */}
            <div style={{width:320}} className="text-xs my-4 w-1/4">
                <p className="text-center">
                    Si ha olvidado su contraseña, introduzca sus direccion de correo electronico o el inicio de sesión
                    La información de la cuenta será enviada a usted por correo electronico junto con un codigo para restablecer su contraseña. 
                    Gracias. El formulario de solicitud .
                </p>
            </div>
            {/* boton */}
            <div>
                <button style={{ backgroundColor: "#262261" }} className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                    Restablecer mi contraseña
                </button>
            </div>
        </div>
    )
}
