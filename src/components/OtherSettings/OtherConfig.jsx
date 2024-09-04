"use client";
import { Dialog, Transition, Switch } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import SelectInput from "@/src/components/form/SelectInput";
import Image from "next/image";

export function OtherConfig() {
  const [enabled, setEnabled] = useState(false);
  const [theme, setTheme] = useState(false);
  const [address, setAddress] = useState(false);
  const [various, setVarious] = useState(false);
  const [activeTabIndexName, setActiveTabIndexName] = useState(0);
  const [activeTabIndexAddress, setActiveTabIndexAddress] = useState(0);
  return (
    <>
      <div className="mr-3 pb-10 w-full h-full overflow-y-auto">
        <h1 className="pb-2 w-full">Otras configuraciones</h1>
        <div className="bg-white rounded-lg p-5">
          <h1>Formato de fecha y hora</h1>
          <div className="mt-3 flex">
            <div className="w-2/3">
              <SelectInput
                label={"Utilizar las preferencias para:"}
                options={[
                  {
                    name: "Español",
                    id: 0,
                  },
                ]}
                placeholder="Seleccionar"
              />
            </div>
            <div className="w-1/3 text-xs flex items-center justify-end">
              <div className="relative pl-2 w-36">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-5 border-l-2"></div>
                <p>Ejemplo de fecha:</p>
                <p>6 de junio 2024 6/6/2024</p>
              </div>
            </div>
          </div>
          <div className="mt-3 flex">
            <div className="w-2/3 flex items-center">
              <Switch
                checked={enabled}
                onChange={setEnabled}
                className="group relative flex h-5 w-12 cursor-pointer rounded-full bg-zinc-300 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-indigo-300"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-indigo-600 ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                />
              </Switch>
              <p className="ml-2 text-sm">Formarto de 24 horas</p>
            </div>
            <div className="w-1/3 text-xs flex items-center justify-end">
              <div className="relative pl-2 w-36">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-5 border-l-2"></div>
                <p>Ejemplo de hora:</p>
                <p>10:25 pm</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 mt-2">
          <div onClick={() => setAddress(!address)} className="cursor-pointer">
            <h1>Correo</h1>
          </div>
          {address && (
            <>
              <div className="mt-3 flex">
                <div className="w-2/12 flex items-center">
                  <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    className="group relative flex h-5 w-12 cursor-pointer rounded-full bg-zinc-300 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-indigo-300"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-indigo-600 ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                    />
                  </Switch>
                </div>
                <div className="w-10/12 flex items-center">
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-5 border-l-2"></div>
                    <h1 className="text-sm">
                      Seguimiento del correo electrónico saliente
                    </h1>
                    <p className="text-xs">
                      Cuando se recibe un acuse de recibo de lectura, el mensaje
                      enviado se marca como leído.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex">
                <div className="w-2/12 flex items-center">
                  <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    className="group relative flex h-5 w-12 cursor-pointer rounded-full bg-zinc-300 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-indigo-300"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-indigo-600 ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                    />
                  </Switch>
                </div>
                <div className="w-10/12 flex items-center">
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-5 border-l-2"></div>
                    <h1 className="text-sm">
                      Seguir los clics en los enlaces de los correos
                      electrónicos salientes
                    </h1>
                    <p className="text-xs">
                      Se hace un seguimiento de todos los clics en los enlaces.
                      Puede utilizarlo para automatizar las ventas. Por ejemplo,
                      un representante de ventas puede recibir una notificación
                      cuando un cliente hace clic en un enlace de pago.
                      <br />
                      <span className="underline">Más información</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full mt-2">
                <SelectInput
                  label={
                    "Dirección de correo electrónico predeterminada del remitente"
                  }
                  //   options={[
                  //     {
                  //       name: "Español",
                  //       id: 0,
                  //     },
                  //   ]}
                  placeholder="info@tudireccióndeagencia.com"
                />
              </div>
              <p className="text-xs mt-2">
                Esta dirección se utilizará para todos los correos electrónicos
                salientes, a menos que la configuración del correo electrónico
                especifique remitentes diferentes.
              </p>
            </>
          )}
        </div>
        <div className="bg-white rounded-lg p-5 mt-2">
          <div onClick={() => setTheme(!theme)} className="cursor-pointer">
            <h1>Mapas</h1>
          </div>
          {theme && (
            <>
              <div className="w-full mt-2">
                <SelectInput
                  label={"Proveedor de mapas"}
                  options={[
                    {
                      name: "Google",
                      id: 0,
                    },
                    {
                      name: "OpenStreetMap",
                      id: 1,
                    },
                  ]}
                  placeholder="Seleccionar un proveedor de mapas"
                />
              </div>
            </>
          )}
        </div>
        <div className="bg-white rounded-lg p-5 mt-2">
          <div onClick={() => setVarious(!various)} className="cursor-pointer">
            <h1>Diversos</h1>
          </div>
          {various && (
            <>
              <div className="mt-3 flex">
                <div className="w-2/12 flex items-center">
                  <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    className="group relative flex h-5 w-12 cursor-pointer rounded-full bg-zinc-300 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-indigo-300"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-indigo-600 ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                    />
                  </Switch>
                </div>
                <div className="w-10/12 flex items-center">
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-5 border-l-2"></div>
                    <h1 className="text-sm">
                      Todos los empleados pueden instalar aplicaciones desde el
                      Market
                    </h1>
                    <p className="text-xs">
                      Cualquier empleado puede instalar aplicaciones desde el
                      Market si el desarrollador de la aplicación lo permite. Si
                      esta opción está desactivada, solo el administrador puede
                      instalar aplicaciones.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex">
                <div className="w-2/12 flex items-center">
                  <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    className="group relative flex h-5 w-12 cursor-pointer rounded-full bg-zinc-300 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-indigo-300"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-indigo-600 ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                    />
                  </Switch>
                </div>
                <div className="w-10/12 flex items-center">
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-5 border-l-2"></div>
                    <h1 className="text-sm">
                      Todos los usuarios pueden comprar una suscripción a
                      EasyWork
                    </h1>
                    <p className="text-xs">
                      Cualquier empleado puede pagar su suscripción a Easywork.
                      Si esta opción está desactivada, solo el administrador
                      puede pagar la suscrición de EasyWork
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex">
                <div className="w-2/12 flex items-center">
                  <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    className="group relative flex h-5 w-12 cursor-pointer rounded-full bg-zinc-300 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-indigo-300"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-indigo-600 ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                    />
                  </Switch>
                </div>
                <div className="w-10/12 flex items-center">
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-5 border-l-2"></div>
                    <h1 className="text-sm">
                      Permitir que se muestre el perfil del usuario
                    </h1>
                    <p className="text-xs">
                      EL indicador de nivel de estrés es visible en el perfil de
                      cada persona
                      <br />
                      <b className="underline">Mas informacion</b>
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex">
                <div className="w-2/12 flex items-center">
                  <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    className="group relative flex h-5 w-12 cursor-pointer rounded-full bg-zinc-300 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-indigo-300"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-indigo-600 ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                    />
                  </Switch>
                </div>
                <div className="w-10/12 flex items-center">
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-5 border-l-2"></div>
                    <h1 className="text-sm">
                      Recopilar datos de geolocalización de los dispositivos
                      móviles de los empleados
                    </h1>
                    <p className="text-xs">
                      Se recopilan datos de geolocalización del usuario. Más
                      insformación
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
