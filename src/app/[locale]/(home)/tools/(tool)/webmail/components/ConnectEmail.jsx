"use client";
import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import Tag from "../../../../../../../components/Tag";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { getTokenGoogle } from "../../../../../../../lib/apis";
import { setCookie, getCookie } from "cookies-next";
import useAppContext from "../../../../../../../context/app";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { toast } from "react-toastify";
import * as yup from "yup";
import axios from "axios";

export default function ConnectEmail({ previousModalPadding, subLabelTag }) {
  const { t } = useTranslation();
  const session = useSession();
  const router = useRouter();

  const [label, setLabel] = useState("");
  const [subLabel, setSubLabel] = useState("");
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const emails = [
    {
      name: "Gmail",
      src: "/icons/emails/gmail.svg",
      click: () => router.push(`${window.location.pathname}?configemail=true&isEdit=false`),
    },
    {
      name: "ICloud",
      src: "/icons/emails/icloud.svg",
      click: "",
    },
    {
      name: "Outlook",
      src: "/icons/emails/outlook.svg",
      click: "",
    },
    {
      name: "Exchange",
      src: "/icons/emails/exchange.svg",
      click: "",
    },
    {
      name: "Yahoo!",
      src: "/icons/emails/yahoo.svg",
      click: "",
    },
    {
      name: "Office 365",
      src: "/icons/emails/office365.svg",
      click: "",
    },
    {
      name: "IMAP",
      src: "/icons/emails/imap.svg",
      click: "",
    },
  ];

  return (
    <Transition.Root show={params.get("connectemail")} as={Fragment}>
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
                        title={label}
                        onclick={() => router.back()}
                        className="bg-easywork-main"
                      />
                      {subLabelTag && (
                        <Tag
                          title={subLabel}
                          className="bg-easywork-main pl-2"
                          closeIcon
                          second
                        />
                      )}
                    </div>
                    <div className="bg-gray-300 max-md:w-screen rounded-l-2xl overflow-y-auto h-screen p-7 md:w-3/4 lg:w-3/4">
                      <div className="w-full rounded-xl text-easywork-main mb-4">
                        <h1 className="ml-3 py-3 font-medium text-xl">
                          Integración del buzón
                        </h1>
                      </div>
                      <div className="w-full bg-white rounded-xl drop-shadow-md text-easywork-main mb-4">
                        <h1
                          className="ml-3 w-full py-5 text-center font-medium text-xl"
                          onClick={() => {
                            router.push("/tools/webmail?page=1");
                          }}
                        >
                          Use y gestione su buzón
                        </h1>
                      </div>
                      <div className="w-full bg-white rounded-xl drop-shadow-md sm:p-3 px-20 py-10 flex items-center flex-col gap-4">
                        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-4 my-3">
                          {emails.map((item, index) => (
                            <div
                              className="flex flex-col justify-center bg-gray-100 hover:bg-gray-300 px-10 py-7 rounded-lg cursor-pointer"
                              key={index}
                              onClick={item.click}
                            >
                              <div className="flex justify-center items-center bg-white overflow-hidden rounded-full mb-4 p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6">
                                <Image
                                  width={30}
                                  height={30}
                                  src={item.src}
                                  alt={item.name}
                                  className="object-cover object-center"
                                />
                              </div>
                              <div className="text-center">
                                <h1>{item.name}</h1>
                              </div>
                            </div>
                          ))}
                        </ul>
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
