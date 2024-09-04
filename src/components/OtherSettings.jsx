"use client";
import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  Transition,
  Switch,
  Select,
  Description,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
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
  Hours,
  Rgpd,
  Segurity,
  OtherConfig,
} from "./OtherSettings/index";
import * as yup from "yup";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function OtherSettings({ previousModalPadding, colorTag }) {
  const [isOpen, setIsOpen] = useState(false);
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
                          <ul className="pb-4">
                            {[
                              "Guía de configuración",
                              "Solicitud de implementación",
                            ].map((text, index) => (
                              <li
                                key={index}
                                className={`px-3 py-2 w-full text-white cursor-pointer mt-2 bg-gray-50 hover:bg-gray-400 rounded-md`}
                                onClick={() => index == 1 && setIsOpen(true)}
                              >
                                {text}
                              </li>
                            ))}
                          </ul>
                          <Dialog
                            open={isOpen}
                            onClose={() => setIsOpen(false)}
                            className="relative z-50"
                          >
                            <div className="fixed inset-0 flex w-screen items-center justify-center p-2">
                              <DialogPanel className="max-w-lg space-y-4 border bg-white p-10">
                                <DialogTitle className="font-bold text-center">
                                  EasyWork implementation request
                                </DialogTitle>
                                <Description className="text-center text-sm">
                                  Submit your EasyWork implementation request,
                                  and receive up to 5, offers flom our certified
                                  partners! no worries, all personal
                                  informationis treated as strictly confidential
                                  by EasyWork and our partners. no spam, no
                                  hassle.
                                </Description>
                                <p className="text-center text-sm">
                                  this form SHOULD NOT be used for helpdesk
                                  requests. if you require tech ni cal
                                  assistance and have a commercial subscription.
                                  you can contact us at support24 page.
                                </p>
                                <div className="text-sm">
                                  <input
                                    type="text"
                                    placeholder="Nombre"
                                    className="w-full h-8 rounded-md bg-gray-300 border-0 placeholder-gray-800"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Apellido"
                                    className="w-full h-8 rounded-md bg-gray-300 border-0 placeholder-gray-800 mt-2"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Email"
                                    className="w-full h-8 rounded-md bg-gray-300 border-0 placeholder-gray-800 mt-2"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Teléfono"
                                    className="w-full h-8 rounded-md bg-gray-300 border-0 placeholder-gray-800 mt-2"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Pais"
                                    className="w-full h-8 rounded-md bg-gray-300 border-0 placeholder-gray-800 mt-2"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Implementation request"
                                    className="w-full h-8 rounded-md bg-gray-300 border-0 placeholder-gray-800 mt-2"
                                  />
                                  <textarea
                                    placeholder="Campo de comentarios"
                                    className="w-full h-36 rounded-md bg-gray-300 border-0 placeholder-gray-800 mt-2"
                                  ></textarea>
                                </div>
                                <div className="mt-2">
                                  <div className="flex items-center">
                                    <input type="checkbox" />
                                    <p className="ml-2 text-xs">
                                      I acknowledge that i have read and
                                      understood EasyWork Privacy Policy and
                                      agree to be contacted by authorized
                                      easyWork partners
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-center text-white rounded-md w-full bg-easywork-main text-sm p-2 hover:bg-easywork-mainhover mt-2"
                                  >
                                    Submit
                                  </button>
                                </div>
                              </DialogPanel>
                            </div>
                          </Dialog>
                        </div>
                      </div>
                      <div className="w-7/12">
                        {invite == 0 && <Tools />}
                        {invite == 1 && <MyEasywork />}
                        {invite == 2 && <CommunicationFlow />}
                        {invite == 3 && <Users />}
                        {invite == 4 && <Details />}
                        {invite == 5 && <Hours />}
                        {invite == 6 && <Rgpd />}
                        {invite == 7 && <Segurity />}
                        {invite == 8 && <OtherConfig />}
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
