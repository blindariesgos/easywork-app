"use client";
import React, { useEffect, useState } from "react";
import Header from "../../../../components/header/Header";
import { ClockIcon, CalendarIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { toast } from "react-toastify";
import { getCookie } from "cookies-next";
import HelpChat from "../../../../components/HelpChat";

const BACKGROUND_IMAGE_URL = "/img/fondo-home.png";

const TASKS = [
  { title: "Seguimiento prospecto", dueDate: "10/07/2025" },
  { title: "Cristian llamada", dueDate: "20/05/2025" },
  { title: "Enviar correo electrónico a Carlos", dueDate: "14/12/2025" },
];

export default function Page() {
  useEffect(() => {
    const fromUrl = document.referrer ? new URL(document.referrer) : null; // Validador para document.referrer
    const urlParams = window.location.search
      ? new URLSearchParams(window.location.search)
      : null; // Validador para window.location.search

    // Verificar si los parámetros son válidos antes de continuar
    if (fromUrl && urlParams) {
      const rememberSessionParam = urlParams.get("rememberSession");
      if (
        fromUrl.pathname === "/auth" &&
        getCookie("rememberSession") === "true" &&
        rememberSessionParam === "true"
      ) {
        toast.success("Datos guardados");
      }
    } else {
      // Manejar el caso en que los parámetros sean nulos o indefinidos (opcional)
      console.warn(
        "No se pudo obtener la URL de referencia o los parámetros de búsqueda."
      );
      // Puedes mostrar un mensaje al usuario, registrar el error, etc.
    }
  }, []);

  let texto =
    "Nathaly Gomez M . Se ha vencido la tarea Seguimiento oportunidad “Naty Polin P-1” “Naty Polin P-2” “Naty Polin P-3” “Naty Polin P-4”";
  let textoRecortado = texto.substring(0, 81);

  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="bg-center bg-cover rounded-2xl px-2"
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})` }}
    >
      {/* Flexbox para controlar el footer */}
      <div className="w-full py-5 h-full">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-x-4 gap-y-0">
          <div className="h-64 bg-white rounded-lg p-2">
            <h1 className="h-1/4 font-medium">Actividades vencidas</h1>
            <div className="h-2/4 flex justify-center">
              <ClockIcon className="h-16 w-16 text-slate-400" />
            </div>
            <div className="h-1/4 flex justify-center items-center bg-slate-200 shadow-lg text-center rounded-lg">
              <h1 className="text-sm">
                ¡Buen trabajo! No tienes actividades vencidas
              </h1>
            </div>
          </div>
          <div className="h-64 bg-white rounded-lg p-2 md:col-start-2">
            <h1 className="h-1/4 font-medium">Actividades de hoy</h1>
            <div className="h-2/4 flex justify-center">
              <CalendarIcon className="h-16 w-16 text-slate-400" />
            </div>
            <div className="h-1/4 flex justify-center items-center bg-slate-200 shadow-lg text-center rounded-lg">
              <h1 className="text-sm">No tienes actividades para hoy</h1>
            </div>
          </div>
          <div className="h-64 bg-white rounded-lg p-2 md:col-start-3">
            <h1 className="h-1/6 font-medium">Actividades próximas</h1>
            <ul className="h-3/6 p-1">
              <li className="flex items-center mb-3">
                <input type="checkbox" className="shadow-slate-200" />
                <div className="ml-2">
                  <h3 className="text-sm">Seguimiento prospecto</h3>
                  <p className="text-xs">Vencimiento: 10/07/2025</p>
                </div>
              </li>
              <li className="flex items-center mb-3">
                <input type="checkbox" />
                <div className="ml-2">
                  <h3 className="text-sm">Cristian llamada</h3>
                  <p className="text-xs">Vencimiento: 20/05/2025</p>
                </div>
              </li>
              <li className="flex items-center mb-3">
                <input type="checkbox" />
                <div className="ml-2">
                  <h3 className="text-sm">
                    Enviar correo electrónico a Carlos
                  </h3>
                  <p className="text-xs">Vencimiento: 14/12/2025</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="h-64 bg-white rounded-lg p-2 md:col-start-4">
            <h1 className="h-1/6 font-medium">
              Pólizas que requieren atención
            </h1>
            <ul className="h-3/6 p-1">
              <li className="flex items-center mb-3">
                <Image
                  className="h-12 w-12 rounded-full object-cover"
                  width={36}
                  height={36}
                  src="https://images.unsplash.com/photo-1542309667-2a115d1f54c6?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />
                <div className="ml-3">
                  <h3 className="text-sm">Renovación póliza de vida</h3>
                  <p className="text-xs text-slate-500">
                    $2.500,00 Ago. 18, 2023
                  </p>
                </div>
              </li>
              <li className="flex items-center mb-3">
                <Image
                  className="h-12 w-12 rounded-full object-cover"
                  width={36}
                  height={36}
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />
                <div className="ml-2">
                  <h3 className="text-sm">Venta póliza de auto</h3>
                  <p className="text-xs text-slate-500">
                    $2.500,00 Ago. 18, 2023
                  </p>
                </div>
              </li>
              <li className="flex items-center mb-3">
                <Image
                  className="h-12 w-12 rounded-full object-cover"
                  width={36}
                  height={36}
                  src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=1889&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />
                <div className="ml-2">
                  <h3 className="text-sm">Renovación póliza de auto</h3>
                  <p className="text-xs text-slate-500">
                    $2.500,00 Ago. 18, 2023
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="col-span-1 md:col-span-2 md:row-start-2 bg-white rounded-lg p-2 h-72">
            <h1 className="h-1/6 font-medium">Recordatorios recientes</h1>
            <ul className="h-5/6 p-1 overflow-y-auto">
              <li className="flex items-center mb-3">
                <Image
                  className="h-12 w-12 rounded-full object-cover"
                  width={36}
                  height={36}
                  src="https://images.unsplash.com/photo-1542309667-2a115d1f54c6?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />
                <div className="ml-3">
                  <h3 className="text-sm">
                    Lorena FloresM ha cumplimentado el popup Copia de Formulario
                    Agencia popup
                  </h3>
                  <p className="text-xs text-slate-500">hace 6 días. 4 horas</p>
                </div>
              </li>
              <li className="flex items-center mb-3">
                <Image
                  className="h-12 w-12 rounded-full object-cover"
                  width={36}
                  height={36}
                  src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />
                <div className="ml-2">
                  <h3 className="text-sm">
                    Nathaly Gomez M. te ha asignado la tarea Cristian
                  </h3>
                  <p className="text-xs text-slate-500">hace 1 semana</p>
                </div>
              </li>
              <li className="flex items-center mb-3">
                <Image
                  className="h-12 w-12 rounded-full object-cover"
                  width={36}
                  height={36}
                  src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />
                <div className="ml-2">
                  <h3
                    className="text-sm"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    {isHovered ? texto : textoRecortado}
                  </h3>
                  <p className="text-xs text-slate-500">hace 1 semana</p>
                </div>
              </li>
              <li className="flex items-center mb-3">
                <Image
                  className="h-12 w-12 rounded-full object-cover"
                  width={36}
                  height={36}
                  src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=1889&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />
                <div className="ml-2">
                  <h3 className="text-sm">
                    Esteban ha cumplimentado el formulario en
                    agenciamunditodigital
                  </h3>
                  <p className="text-xs text-slate-500">hace 1 semana</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="col-span-1 md:col-span-2 md:col-start-3 md:row-start-2 bg-white rounded-lg p-2 h-72">
            <h1 className="h-1/6 font-medium">
              Contactos que requieren atención
            </h1>
            <ul className="h-3/6 p-1">
              <li className="flex items-center mb-3">
                <Image
                  className="h-12 w-12 rounded-full object-cover"
                  width={36}
                  height={36}
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />
                <div className="ml-3">
                  <h3 className="text-sm">Nathaly Polin</h3>
                  <p className="text-xs text-slate-500">+5263524120</p>
                </div>
              </li>
              <li className="flex items-center mb-3">
                <Image
                  className="h-12 w-12 rounded-full object-cover"
                  width={36}
                  height={36}
                  src="https://images.unsplash.com/photo-1542309667-2a115d1f54c6?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />
                <div className="ml-3">
                  <h3 className="text-sm">Ezequiel Trodler</h3>
                  <p className="text-xs text-slate-500">+525566742902</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <HelpChat />
    </div>
  );
}
