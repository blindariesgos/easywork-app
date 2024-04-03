import React from "react";
import Image from "next/image";
import { LockClosedIcon, UserIcon } from '@heroicons/react/24/solid';

export default function Login() {
    return (
        <div class="flex flex-col items-center justify-center">
            {/* Logo */}
            <div class="mb-2">
                <Image
                    width={156.75}
                    height={118.84}
                    src={"/img/logo.svg"}
                />
            </div>
            {/* Usuario */}
            <div class="relative text-gray-600 focus-within:text-gray-400">
                <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                    <button type="submit" class="p-1 focus:outline-none focus:shadow-outline">
                        <UserIcon className="h-5 w-5 text-easywork-main" />
                    </button>
                </span>
                <input style={{ border: 'none' }} type="search" name="q" class="py-2 text-sm rounded-md pl-10 focus:text-gray-900" placeholder="Usuario" autocomplete="off" />
            </div>
            {/* Contraseña */}
            <div class="relative text-gray-600 focus-within:text-gray-400 mt-2">
                <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                    <button type="submit" class="p-1 focus:outline-none focus:shadow-outline">
                        <LockClosedIcon className="h-5 w-5 text-easywork-main" />
                    </button>
                </span>
                <input style={{ border: 'none' }} type="search" name="q" class="py-2 text-sm rounded-md pl-10 focus:text-gray-900" placeholder="Contraseña" autocomplete="off" />
            </div>
            {/* Recordar contraseña */}
            <div class="flex justify-between my-4 text-sm">
                <input type="checkbox" />
                <p class="ml-1">Recordar en esta computadora</p>
            </div>
            {/* Ingresar */}
            <div class="my-2">
                <button style={{ backgroundColor: "#262261" }} class="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                    Inicio de sesión
                </button>
            </div>
            {/* Recuperar */}
            <div class="text-violet-900 text-xs w-full my-4 underline">
                <a href="#">¿Olvidó su contraseña?</a>
                <a class="ml-7" href="#">Recordar todos mis datos</a>
            </div>
            {/* Video guia */}
            <div>
                <button style={{ backgroundColor: "#262261" }} class="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                    ¿Cómo ingresar?
                </button>
            </div>
        </div>
    )
}
