"use client";
import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition, Switch } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import Tag from "./Tag";
import { useRouter, useSearchParams } from "next/navigation";
import { PaperClipIcon, EnvelopeIcon } from "@heroicons/react/20/solid";
import * as yup from "yup";

export default function InviteUser({ previousModalPadding, colorTag }) {
  const [invite, setInvite] = useState(1);
  const { t } = useTranslation();
  const session = useSession();
  const [enabled, setEnabled] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const schema = yup.object().shape({
    responsible: yup.string(),
  });

  const textPassword =
    "La contraseña debe contener al menos 10 símbolos, contienen letras mayúsculas  latina (a-z), contienen letras latinas minúsculas (a-z), contienen los dígitos (0-9),contener marcas de puntuación (,.<>/?;:’[]{}|`~!@#$%^&*()-_+=).";

  useEffect(() => {}, [params.get("inviteuser")]);

  return (
    <Transition.Root show={params.get("inviteuser")} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 2xl:pl-52">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel
                  className={`pointer-events-auto w-screen drop-shadow-lg ${previousModalPadding}`}
                >
                  <div className="flex justify-end h-screen">
                    <div className={`flex flex-col`}>
                      <Tag
                        onclick={() => {
                          router.back();
                        }}
                        className={colorTag}
                      />
                    </div>
                    <div className="h-screen rounded-lg bg-gray-300 p-6 flex w-2/3">
                      <div className="w-5/12 mr-3">
                        <h1 className="text-xl">Invitación</h1>
                        <ul className="mt-5">
                          <li
                            className={`${
                              invite === 1
                                ? "bg-easywork-main text-white"
                                : "text-black"
                            } w-full py-1 mt-3 px-2 rounded-md cursor-pointer`}
                            onClick={() => {
                              setInvite(1);
                            }}
                          >
                            Invitar mediante enlace
                          </li>
                          <li
                            className={`${
                              invite === 2
                                ? "bg-easywork-main text-white"
                                : "text-black"
                            } w-full py-1 mt-3 px-2 rounded-md cursor-pointer`}
                            onClick={() => {
                              setInvite(2);
                            }}
                          >
                            Invitar mediante correo electrónico o número de
                            teléfono
                          </li>
                          <li
                            className={`${
                              invite === 3
                                ? "bg-easywork-main text-white"
                                : "text-black"
                            } w-full py-1 mt-3 px-2 rounded-md cursor-pointer`}
                            onClick={() => {
                              setInvite(3);
                            }}
                          >
                            Invitación masiva
                          </li>
                          <li
                            className={`${
                              invite === 4
                                ? "bg-easywork-main text-white"
                                : "text-black"
                            } w-full py-1 mt-3 px-2 rounded-md cursor-pointer`}
                            onClick={() => {
                              setInvite(4);
                            }}
                          >
                            Invitar a un usuario de otra compañía
                          </li>
                        </ul>
                        <div className="w-full bg-slate-50 mt-3 rounded-md p-2">
                          <div className="flex items-center pb-2 border-b-2">
                            <h1 className="w-7/12">
                              Número máximo de usuarios permitidos en su plan
                              actual
                            </h1>
                            <div className="w-5/12 flex items-center justify-end">
                              <p className="text-right text-blue-400">100</p>
                            </div>
                          </div>
                          <div className="flex pt-2 items-center">
                            <h1 className="w-7/12">
                              Usuarios registrados actualmente en su Easywork
                            </h1>
                            <div className="w-5/12 flex items-center justify-end">
                              <p className="text-right text-red-500">11</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-7/12">
                        <div className="bg-white mt-12 rounded-lg p-5">
                          {invite === 1 && (
                            <div>
                              <div className="flex border-b-2 pb-1">
                                <div className="rounded-full p-1 flex justify-center items-center bg-easywork-main">
                                  <PaperClipIcon className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="ml-2">
                                  Invitar mediante enlace
                                </h2>
                              </div>
                              <div className="flex justify-between py-1.5 px-2 my-2 w-full bg-green-500 bg-opacity-20 rounded-md">
                                <p>Permitir registro rápido</p>
                                <Switch
                                  checked={enabled}
                                  onChange={setEnabled}
                                  className="group relative flex h-5 w-12 cursor-pointer rounded-full bg-green-300 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-green-300"
                                >
                                  <span
                                    aria-hidden="true"
                                    className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-green-500 ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                                  />
                                </Switch>
                              </div>
                              <div>
                                <p className="text-xs">
                                  Enlace de registro rápido
                                </p>
                                <div className="flex items-center">
                                  <input
                                    type="text"
                                    className="w-full h-8 rounded-md"
                                  />
                                  <div className="ml-2 w-48 flex justify-center items-center h-full">
                                    <button className="bg-easywork-main hover:bg-easywork-mainhover w-full rounded-md text-white py-1 px-2">
                                      Copiar Enlace
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <p className="underline text-gray-50 text-sm mt-2">
                                Acutalizar enlace
                              </p>
                              <div className="flex mt-2 items-center">
                                <input type="checkbox" />
                                <p className="ml-2 text-sm">
                                  Solicite la aprobación del administrador para
                                  unirse
                                </p>
                              </div>
                            </div>
                          )}
                          {invite === 2 && (
                            <div>
                              <div className="flex border-b-2 pb-1">
                                <div className="rounded-full p-1 flex justify-center items-center bg-easywork-main">
                                  <EnvelopeIcon className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="ml-2">
                                  Invitar mediante correo electrónico o número
                                  de teléfono
                                </h2>
                              </div>
                              <div className="mt-2 flex pb-3 border-b-2">
                                <div>
                                  <p className="text-xs">
                                    E-mail o número de teléfono
                                  </p>
                                  {Array.from({ length: 5 }).map((_, index) => (
                                    <input
                                      key={index}
                                      type="text"
                                      placeholder="E-mail o número de teléfono"
                                      className="w-full h-6 mt-1 text-xs rounded-md"
                                    />
                                  ))}
                                </div>
                                <div className="ml-1">
                                  <p className="text-xs">Nombre</p>
                                  {Array.from({ length: 5 }).map((_, index) => (
                                    <input
                                      key={index}
                                      type="text"
                                      placeholder="Nombre"
                                      className="w-full h-6 mt-1 text-xs rounded-md"
                                    />
                                  ))}
                                </div>
                                <div className="ml-1">
                                  <p className="text-xs">Apellido</p>
                                  {Array.from({ length: 5 }).map((_, index) => (
                                    <input
                                      key={index}
                                      type="text"
                                      placeholder="Apellido"
                                      className="w-full h-6 mt-1 text-xs rounded-md"
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="flex mt-6 items-center">
                                <button className="bg-white border-2 p-2">
                                  + Agregar más
                                </button>
                                <p className="ml-2">
                                  o{" "}
                                  <span className="text-blue-600 underline">
                                    Invitación masiva
                                  </span>
                                </p>
                              </div>
                            </div>
                          )}
                          {invite === 3 && (
                            <div>
                              <div className="flex border-b-2 pb-1">
                                <div className="rounded-full p-1 flex justify-center items-center bg-easywork-main">
                                  <PaperClipIcon className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="ml-2">Invitación masiva</h2>
                              </div>
                              <div className="mt-3">
                                <p className="text-sm">
                                  Introduzca las direcciones de correo
                                  electrónico o los números de teléfono de las
                                  personas a las que desea invitar, separe
                                  varias entradas con una coma o un espacio.
                                </p>
                                <textarea className="w-full h-64"></textarea>
                                <p className="text-xs">
                                  Puede introducir varios correos electrónicos o
                                  números de teléfono
                                </p>
                              </div>
                            </div>
                          )}
                          {invite === 4 && (
                            <div>
                              <div className="flex border-b-2 pb-1">
                                <div className="rounded-full p-1 flex justify-center items-center bg-easywork-main">
                                  <EnvelopeIcon className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="ml-2">Invitar a un usuario de otra compañía</h2>
                              </div>
                              <div className="mt-2">
                                <p className="text-xs">Invitar compañía</p>
                                <div className="flex items-center">
                                  <input
                                    type="text"
                                    className="w-full h-8 rounded-md"
                                  />
                                </div>
                              </div>
                              <div className="mt-2 flex pb-3 border-b-2">
                                <div>
                                  <p className="text-xs">
                                    E-mail o número de teléfono
                                  </p>
                                  {Array.from({ length: 5 }).map((_, index) => (
                                    <input
                                      key={index}
                                      type="text"
                                      placeholder="E-mail o número de teléfono"
                                      className="w-full h-6 mt-1 text-xs rounded-md"
                                    />
                                  ))}
                                </div>
                                <div className="ml-1">
                                  <p className="text-xs">Nombre</p>
                                  {Array.from({ length: 5 }).map((_, index) => (
                                    <input
                                      key={index}
                                      type="text"
                                      placeholder="Nombre"
                                      className="w-full h-6 mt-1 text-xs rounded-md"
                                    />
                                  ))}
                                </div>
                                <div className="ml-1">
                                  <p className="text-xs">Apellido</p>
                                  {Array.from({ length: 5 }).map((_, index) => (
                                    <input
                                      key={index}
                                      type="text"
                                      placeholder="Apellido"
                                      className="w-full h-6 mt-1 text-xs rounded-md"
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="flex mt-6 items-center">
                                <button className="bg-white border-2 p-2">
                                  + Agregar más
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}