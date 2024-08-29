"use client";
import { Dialog, Transition, Switch } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import Image from "next/image";

export function MyEasywork() {
  const [enabled, setEnabled] = useState(false);
  const [nameEasywork, setNameEasywork] = useState("Easywork");
  const [address, setAddress] = useState(false);
  const [theme, setTheme] = useState(false);
  const [activeTabIndexName, setActiveTabIndexName] = useState(0);
  const [activeTabIndexAddress, setActiveTabIndexAddress] = useState(0);
  return (
    <>
      <div className="bg-white rounded-lg p-5">
        <h1 className="pb-2 w-full">Nombre</h1>
        <p className="mt-3 p-2 text-white text-xs w-full bg-easywork-main">
          Dele a su Easywork un nombre único y/o suba un logotipo. Estos
          elementos se colocarán en la parte superior izquierda de la pantalla,
          y será visibles para todos los empleados.
        </p>
        <div className="mt-2">
          <div className="flex space-x-3 border-b">
            {["Nombre", "Logo"].map((tab, idx) => {
              return (
                <button
                  key={idx}
                  className={`py-1 border-b-4 transition-colors duration-300 ${
                    idx === activeTabIndexName
                      ? "border-easywork-main"
                      : "border-transparent hover:border-gray-200"
                  }`}
                  onClick={() => setActiveTabIndexName(idx)}
                >
                  {tab}
                </button>
              );
            })}
          </div>
          <div className="py-2 border-b-2">
            {activeTabIndexName == 0 && (
              <>
                <p className="text-xs">El nombre de su Easywork</p>
                <input
                  className="h-8 rounded-md text-sm"
                  type="text"
                  onChange={(e) => setNameEasywork(e.target.value)}
                />
                <div className="flex items-center mt-1">
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
                  <p className="ml-2">Dejar Easywork en el nombre</p>
                </div>
              </>
            )}
            {activeTabIndexName == 1 && (
              <>
                <p className="text-xs">
                  Cargue una imagen PNG del logotipo con fonto transparente
                  tamaño máximo de la imagen es de 444 x 110 px.
                </p>
                <div className="border-2 h-32 w-44 rounded-md mt-1"></div>
                <p className="text-xs mt-1">
                  La imagen que ve a la derecha muestra el aspecto que tendrá su
                  logotipo.
                </p>
              </>
            )}
          </div>
          <div className="mt-5">
            <p className="text-xs">
              El nombre de su empresa aparecerá en correos electrónicos,
              enlaces, catálogo, y Drive
            </p>
            <input
              className="h-8 rounded-md text-sm"
              type="text"
              onChange={(e) => setNameEasywork(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg p-5 mt-2">
        <div onClick={() => setAddress(!address)} className="cursor-pointer">
          <h1>Dirección de Easywork</h1>
        </div>
        {address && (
          <>
            <p className="mt-3 p-2 text-white text-xs w-full bg-easywork-main">
              Piensa en una dirección fácil de recordar, por ejemplo, el nombre
              de su empresa. de manera alternativa, puede conectar la dirección
              de su dominio empresarial. más información.
            </p>
            <div className="mt-2">
              <div className="flex space-x-3 border-b">
                {["Crear dirección", "Usar un dominio propio"].map(
                  (tab, idx) => {
                    return (
                      <button
                        key={idx}
                        className={`py-1 border-b-4 transition-colors duration-300 ${
                          idx === activeTabIndexAddress
                            ? "border-easywork-main"
                            : "border-transparent hover:border-gray-200"
                        }`}
                        onClick={() => setActiveTabIndexAddress(idx)}
                      >
                        {tab}
                      </button>
                    );
                  }
                )}
              </div>
              <div className="py-2">
                {activeTabIndexAddress == 0 && (
                  <>
                    <p className="text-xs">
                      Ahora esta es la dirección de su EasyWork. Cópiela y
                      compártala con todos los empleados.
                    </p>
                    <div className="flex">
                      <input
                        className="h-8 rounded-l-md border-l-2 border-y-2 border-r-0 text-sm w-full"
                        type="text"
                        onChange={(e) => setNameEasywork(e.target.value)}
                      />
                      <button className="border-r-2 border-y-2 h-8 rounded-r-md text-easywork-main text-xs p-1 w-14">
                        Copiar
                      </button>
                    </div>
                  </>
                )}
                {activeTabIndexAddress == 1 && (
                  <>
                    <p className="text-xs mt-2">
                      1. Agregue 4 registros de tipo "IN NS" en el editor DNS de
                      su dominio. Puede eliminar otros registros de este dominio
                      si existen.
                    </p>
                    <ul className="text-xs mt-1 p-3 bg-gray-300">
                      <li>ns-1277.awsdns.31.org</li>
                      <li className="mt-1">ns-310.awsdns.38.com</li>
                      <li className="mt-1">ns-581.awsdns.08.net</li>
                      <li className="mt-1">ns-1613.awsdns.09.co.uk</li>
                    </ul>
                    <p className="text-xs mt-2">
                      2. Póngase en contacto con el Servicio de asistencia de
                      EasyWork. Solo los administradores de EasyWork pueden
                      ponerse en contacto con el servicio de asistencia.
                    </p>
                    <p className="text-xs mt-2">
                      3. Proporcione el nombre completo de su dominio, y la
                      prueba del cambio de los registros NS que hizo en el paso
                      1. Puede ser una captura de pantalla del editor DNS.
                    </p>
                    <p className="text-xs mt-2 text-green-500 hover:text-green-600 underline">
                      Comunicarse con el servicio de asistencia de EasyWork.
                    </p>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="bg-white rounded-lg p-5 mt-2">
        <div onClick={() => setTheme(!theme)} className="cursor-pointer">
          <h1>Tema predeterminado</h1>
        </div>
        {theme && (
          <>
            <p className="mt-3 text-sm w-full">
              Establezca en tema visual común para todos los empleados.
              Seleccione uno de los temas de stock o cree el fondo de su imagen
              empresarial.
              <br />
              <span className="text-green-500 underline">Más información</span>
            </p>
            <div className="mt-2">
              <div className="p-2 grid gap-2 grid-cols-2">
                {[
                  "rectangle",
                  "rectangle",
                  "rectangle",
                  "rectangle",
                  "rectangle",
                  "rectangle",
                  "rectangle",
                  "rectangle",
                ].map((tab, idx) => {
                  return (
                    <Image
                      className="w-52"
                      width={80}
                      height={60}
                      src={`/img/backgroundTest/${tab}_${idx}.png`}
                      alt={`test${idx}`}
                    />
                  );
                })}
              </div>
              <div className="mt-3 flex items-center">
                <input type="checkbox" />
                <p className="ml-2 text-sm">
                  Tema predeterminado para todos los usuarios
                </p>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <div className="flex">
                  <button className="p-2 rounded-md bg-easywork-main hover:bg-easywork-mainhover text-white">
                    Guardar
                  </button>
                  <button className="ml-2 p-2 rounded-md bg-gray-50 hover:bg-gray-400 text-white">
                    Cancelar
                  </button>
                </div>
                <p className="text-sm">Tema personalizado</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
