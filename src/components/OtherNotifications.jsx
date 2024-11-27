"use client";
import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition, Switch } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import Tag from "./Tag";
import { useRouter, useSearchParams } from "next/navigation";
// import TextEditor from "../../tasks/components/TextEditor";
// import SelectDropdown from "./SelectDropdown";
import useAppContext from "../context/app";
import { toast } from "react-toastify";
import * as yup from "yup";
import axios from "axios";

export default function OtherNotifications({ previousModalPadding, colorTag }) {
  const { t } = useTranslation();
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [enabled, setEnabled] = useState(false);

  const schema = yup.object().shape({
    responsible: yup.string(),
  });

  useEffect(() => {}, [params.get("othernotifications")]);

  return (
    <Transition.Root show={params.get("othernotifications")} as={Fragment}>
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
                    <div className="h-screen rounded-lg bg-white p-6">
                      <h1>Configuración / Notificaciones</h1>
                      <div className="py-2 px-32 my-2 bg-green-500 bg-opacity-20">
                        <h1>
                          Gestiona que tipo de notificación recibir y por que
                          medio.
                        </h1>
                      </div>
                      <div className="flex my-4 text-sm">
                        <h1 className="w-1/2">Tipo de notificación</h1>
                        <div className="flex w-1/2 justify-between text-easywork-mainhover">
                          <h1>Email</h1>
                          <h1>En aplicación</h1>
                          <h1>Aplicación movil</h1>
                        </div>
                      </div>
                      <div className="text-sm flex mb-7">
                        <div className="w-1/2">
                          <h1 className="font-semibold">
                            Chatbot cumplimentado
                          </h1>
                          <p>Chatbot cumplimiento</p>
                        </div>
                        <div className="flex w-1/2 justify-between text-blue-500">
                          <div>
                            {" "}
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
                          <div>
                            {" "}
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
                          <div>
                            {" "}
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
                        </div>
                      </div>
                      <div className="text-sm flex mb-7">
                        <div className="w-1/2">
                          <h1 className="font-semibold">CLiente asignado</h1>
                          <p>Te han asignado un cliente</p>
                        </div>
                        <div className="flex w-1/2 justify-between text-blue-500">
                          <div>
                            {" "}
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
                          <div>
                            {" "}
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
                          <div>
                            {" "}
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
                        </div>
                      </div>
                      <div className="text-sm flex mb-7">
                        <div className="w-1/2">
                          <h1 className="font-semibold">Tarea vencida</h1>
                          <p>Tienes una tarea vencida</p>
                        </div>
                        <div className="flex w-1/2 justify-between text-blue-500">
                          <div>
                            {" "}
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
                          <div>
                            {" "}
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
                          <div>
                            {" "}
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
                        </div>
                      </div>
                      <div className="text-sm flex mb-7">
                        <div className="w-1/2">
                          <h1 className="font-semibold">Tarea adignada</h1>
                          <p>Te han asignado una tarea</p>
                        </div>
                        <div className="flex w-1/2 justify-between text-blue-500">
                          <div>
                            {" "}
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
                          <div>
                            {" "}
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
                          <div>
                            {" "}
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
                        </div>
                      </div>
                      <div className="text-sm flex mb-7">
                        <div className="w-1/2">
                          <h1 className="font-semibold">Invitación a evento</h1>
                          <p>Te han invitado a un evento</p>
                        </div>
                        <div className="flex w-1/2 justify-between text-blue-500">
                          <div>
                            {" "}
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
                          <div>
                            {" "}
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
                          <div>
                            {" "}
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
                        </div>
                      </div>
                      <div className="flex w-full justify-end mt-2">
                        <button className="bg-easywork-main hover:bg-easywork-mainhover text-white p-2 rounded-md">
                          Actualizar
                        </button>
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
