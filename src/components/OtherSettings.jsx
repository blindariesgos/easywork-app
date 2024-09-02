"use client";
import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition, Switch, Select } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import Tag from "./Tag";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PaperClipIcon,
  EnvelopeIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import {
  Tools,
  MyEasywork,
  CommunicationFlow,
  Users,
  Details,
} from "./OtherSettings/index";
import * as yup from "yup";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function OtherSettings({ previousModalPadding, colorTag }) {
  const [invite, setInvite] = useState(0);
  const { t } = useTranslation();
  const session = useSession();
  const [enabled, setEnabled] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const schema = yup.object().shape({
    responsible: yup.string(),
  });

  useEffect(() => {}, [params.get("othersettings")]);

  return (
    <Transition.Root show={params.get("othersettings")} as={Fragment}>
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
                    <div className="h-screen flex rounded-lg bg-gray-300 p-6 max-md:w-full w-2/3">
                      <div className="w-5/12">
                        <h1 className="ml-3 mb-3 text-lg">Configuración</h1>
                        <div className="mr-3">
                          <div className="flex items-center w-full bg-white px-2 py-1 rounded-md mb-2">
                            <FaMagnifyingGlass className="h-4 w-4 text-primary" />
                            <input
                              type="search"
                              name="search"
                              id="search-cal"
                              className="block w-full py-1.5 text-primary placeholder:text-primary border-0 focus:ring-0"
                              placeholder={t("contacts:header:search")}
                            />
                          </div>
                          <ul className="border-b-2 border-black pb-4">
                            {[
                              "Herramientas",
                              "Mi EasyWork",
                              "Flujo de comunicación",
                              "Usuario",
                              "Detalles de la empresa",
                              "Horario laboral",
                              "Cumpliento de GPRD",
                              "Seguridad",
                              "Otras configuraciones",
                            ].map((text, index) => (
                              <li
                                key={index}
                                className={`px-3 py-2 w-full cursor-pointer ${
                                  invite === index
                                    ? "bg-easywork-main text-white rounded-md"
                                    : ""
                                }`}
                                onClick={() => setInvite(index)}
                              >
                                {text}
                              </li>
                            ))}
                          </ul>
                          <ul className="border-b-2 pb-4">
                            {[
                              "Guía de configuración",
                              "Solicitud de implementación",
                            ].map((text, index) => (
                              <li
                                key={index}
                                className={`px-3 py-2 w-full text-white cursor-pointer mt-2 bg-gray-50 hover:bg-gray-400 rounded-md`}
                                // onClick={() => }
                              >
                                {text}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="w-7/12">
                        {invite == 0 && <Tools />}
                        {invite == 1 && <MyEasywork />}
                        {invite == 2 && <CommunicationFlow />}
                        {invite == 3 && <Users />}
                        {invite == 4 && <Details />}
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
