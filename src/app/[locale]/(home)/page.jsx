import React from "react";
import Header from "@/components/header/Header";
import { ClockIcon, CalendarIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function Page() {
  return (
    <div
      className="bg-center bg-cover rounded-2xl px-2"
      style={{ backgroundImage: "url('/img/fondo-home.png')" }}
    >
<div className="h-full w-full py-5">
  <Header />
  <div className="flex items-center flex-col h-full w-full py-5">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 auto-rows-max px-3 gap-4 mb-4 w-full">
            <div className="max-w-72 h-64 bg-white rounded-lg p-2">
              <h1 className="h-1/4 font-medium">Actividades Vencidas</h1>
              <div className="h-2/4 flex justify-center">
                <ClockIcon className="h-16 w-16 text-slate-400" />
              </div>
              <div className="h-1/4 flex justify-center items-center bg-slate-200 shadow-lg text-center rounded-lg">
                <h1>Buen trabajo!! No tienes actividades vencidas</h1>
              </div>
            </div>
            <div className="max-w-72 h-64 bg-white rounded-lg p-2">
              <h1 className="h-1/4 font-medium">Actividades de Hoy</h1>
              <div className="h-2/4 flex justify-center">
                <CalendarIcon className="h-16 w-16 text-slate-400" />
              </div>
              <div className="h-1/4 flex justify-center items-center bg-slate-200 shadow-lg text-center rounded-lg">
                <h1>No tienes actividades para hoy</h1>
              </div>
            </div>
            <div className="max-w-72 h-64 bg-white rounded-lg p-2">
              <h1 className="h-1/6 font-medium">Actividades Próximas</h1>
              <ul className="h-3/6 p-1">
                <li className="flex items-center mb-3">
                  <input type="checkbox" className="shadow-slate-200" />
                  <div className="ml-2">
                    <h3 className="text-sm">Seguimiento</h3>
                    <p className="text-xs">Vencimiento:</p>
                  </div>
                </li>
                <li className="flex items-center mb-3">
                  <input type="checkbox" />
                  <div className="ml-2">
                    <h3 className="text-sm">Cristian</h3>
                    <p className="text-xs">Vencimiento:</p>
                  </div>
                </li>
                <li className="flex items-center mb-3">
                  <input type="checkbox" />
                  <div className="ml-2">
                    <h3 className="text-sm">texto</h3>
                    <p className="text-xs">Texto</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="max-w-72 h-64 bg-white rounded-lg p-2">
              <h1 className="h-1/6 font-medium">Actividades Próximas</h1>
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
                    <h3 className="text-sm">Naty Polin P-1</h3>
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
                    <h3 className="text-sm">Consultoria Implementa</h3>
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
                    <h3 className="text-sm">texto</h3>
                    <p className="text-xs text-slate-500">Texto</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex max-md:flex-col max-md:gap-2 justify-between px-3 w-full ">
            <div className="w-7/12 h-80 max-md:w-full bg-white rounded-lg p-2">
              <h1 className="h-1/6 font-medium">Recordatorios Recientes</h1>
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
                      Lorena FloresM ha cumplimentado el popup Copia de
                      Formulario Agencia popup
                    </h3>
                    <p className="text-xs text-slate-500">
                      hace 6 días. 4 horas
                    </p>
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
                    <h3 className="text-sm">
                      Nathaly Gomez M . Se ha vencido la tarea Seguimiento
                      oportunidad “Naty Polin P-1”
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
            <div className="w-4/12 h-80 max-md:w-full bg-white rounded-lg p-2">
              <h1 className="h-1/6 font-medium">Actividades Próximas</h1>
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
                    <h3 className="text-sm">Nathaly Polin</h3>
                    <p className="text-xs text-slate-500">
                      naty@gmail.com <br />
                      +5263524120
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
                  <div className="ml-3">
                    <h3 className="text-sm">Ezequiel Trodler</h3>
                    <p className="text-xs text-slate-500">
                      Ezequiel@happpy.com <br />
                      +525566742902
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
