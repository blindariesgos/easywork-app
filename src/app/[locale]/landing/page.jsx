"use client";
import React from "react";
import Image from "next/image";

export default function Page() {
  return (
    <div className="bg-gradient-to-t from-sky-500 to-blue-300 h-screen w-screen overflow-x-hidden">
      <header className="flex items-center justify-between pt-7 px-8">
        <div>
          <Image
            className="w-28"
            width={400}
            height={400}
            src="/img/Layer_3.png"
            alt="Easywork"
          />
        </div>
        <nav>
          <ul className="flex gap-7 text-white font-semibold text-lg items-center">
            <li>Inicio</li>
            <li>Módulos</li>
            <li>Planes</li>
            <li>Contacto</li>
            <li>blog</li>
            <li>
              <button className="bg-easywork-main hover:bg-easywork-mainhover py-2 px-3 rounded-md">
                ES
              </button>
            </li>
            <li>
              <button className="bg-lime-400 hover:bg-lime-500 py-2 px-3 rounded-md text-black">
                Ingresar
              </button>
            </li>
          </ul>
        </nav>
      </header>
      <div className="w-full mt-24 px-8">
        <div className="flex w-full h-full items-center justify-center">
          <Image
            style={{ width: 590 }}
            width={1000}
            height={1000}
            src="/img/landing/cellphone.png"
            alt="cellphone"
          />
          <div className="text-white ml-8" style={{ width: 590 }}>
            <h2 className="font-semibold text-xl">
              ¡Descubre la Revolución en Gestión de Pólizas!
            </h2>
            <h1 className="font-bold text-6xl mb-7">CON EASYWORK</h1>
            <h2
              className="font-semibold text-xl leading-tight mb-2"
              style={{ width: 400 }}
            >
              ¿Por qué conformarse con lo convencional cuando puedes contar con
              lo excepcional?
            </h2>
            <p className="text-lg leading-tight" style={{ width: 400 }}>
              Visualiza una herramienta que no solo organiza pólizas, sino que
              impulsa tus ventas, fortalece relaciones y transforma clientes
              ocasionales en devotos seguidores.
            </p>
          </div>
        </div>
      </div>
      <div className="relative h-96 flex items-end">
        <Image
          className="w-screen absolute"
          width={4000}
          height={4000}
          src="/img/landing/maskblue.svg"
          alt="white"
        />
        <Image
          className="w-screen absolute"
          width={4000}
          height={4000}
          src="/img/landing/maskwhite.svg"
          alt="white"
        />
      </div>
    </div>
  );
}
