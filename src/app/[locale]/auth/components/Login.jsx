import React from "react";
import Image from "next/image";
import { LockClosedIcon, UserIcon } from '@heroicons/react/24/solid';
import ModalVideo from "./ModalVideo";

export default function Login() {
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
            {/* Usuario */}
            <div className="relative text-gray-600 focus-within:text-gray-400">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <button type="submit" className="p-1 focus:outline-none focus:shadow-outline">
                        <UserIcon className="h-5 w-5 text-easywork-main" />
                    </button>
                </span>
                <input style={{ border: 'none' }} type="search" name="q" className="py-2 text-sm rounded-md pl-10 focus:text-gray-900" placeholder="Usuario" autoComplete="off" />
            </div>
            {/* Contraseña */}
            <div className="relative text-gray-600 focus-within:text-gray-400 mt-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <button type="submit" className="p-1 focus:outline-none focus:shadow-outline">
                        <LockClosedIcon className="h-5 w-5 text-easywork-main" />
                    </button>
                </span>
                <input style={{ border: 'none' }} type="search" name="q" className="py-2 text-sm rounded-md pl-10 focus:text-gray-900" placeholder="Contraseña" autoComplete="off" />
            </div>
            {/* Recordar contraseña */}
            <div className="flex justify-between my-4 text-sm">
                <input type="checkbox" />
                <p className="ml-1">Recordar en esta computadora</p>
            </div>
            {/* Ingresar */}
            <div className="my-2">
                <button style={{ backgroundColor: "#262261" }} className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                    Inicio de sesión
                </button>
            </div>
            {/* Recuperar */}
            <div className="text-violet-900 text-xs w-full my-4 underline">
                <a href="#">¿Olvidó su contraseña?</a>
                <a className="ml-7" href="#">Recordar todos mis datos</a>
            </div>
            {/* Video guia */}
            <div>
                <ModalVideo buttonOpen={
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="bg-primary text-white font-bold py-2 px-4 rounded-md"
                    >
                        Cómo ingresar?
                    </button>
                } />
            </div>
        </div>
    )
}
