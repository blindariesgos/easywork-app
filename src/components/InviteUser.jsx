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

export default function InviteUser({ previousModalPadding, colorTag }) {
  const { t } = useTranslation();
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [enabled, setEnabled] = useState(false);

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
                          <li className="bg-gray-400 text-white w-full py-1 mt-3 px-2 rounded-md">
                            Invitar mediante enlace
                          </li>
                          <li className="w-full py-1 mt-4 px-2 rounded-md">
                            Invitar mediante correo electrónico o número de teléfono
                          </li>
                          <li className="w-full py-1 mt-4 px-2 rounded-md">
                            Invitación masiva
                          </li>
                          <li className="w-full py-1 mt-4 px-2 rounded-md">
                            Invitar a un usuario de otra compañia
                          </li>
                        </ul>
                      </div>
                      <div className="w-7/12">
                        <div className="bg-white mt-12 rounded-lg p-5">
                          <div className="flex justify-between border-b-2 pb-1">
                            <h2>Cambiar la contraseña</h2>
                            <p>cancelar</p>
                          </div>
                          <div className="mt-12">
                            <p className="text-sm">Nueva contraseña</p>
                            <input type="password" className="w-full" />
                            <p className="text-sm mt-3">{textPassword}</p>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm">Confirmar contraseña</p>
                            <input type="password" className="w-full" />
                          </div>
                          <button className="bg-white border-2 p-2 mt-10">
                            Cerrar sesión en todos los dispositivos
                          </button>
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
