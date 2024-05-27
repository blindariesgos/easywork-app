"use client";
import Image from "next/image";
import {
  XMarkIcon,
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
const HelpChat = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-3 right-3 flex flex-col items-end">
      <Transition
        show={open}
        as={Fragment}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="bg-gradient-to-r from-green-600 to-green-500 w-72 h-96 rounded-lg pt-3 flex flex-col items-center justify-between">
          <div className="w-full">
            <div className="flex justify-end w-full px-3 ">
              <XMarkIcon
                className="h-5 w-5 text-white cursor-pointer"
                onClick={() => {
                  setOpen(false);
                }}
              />
            </div>
          </div>
          <div className="w-full mt-2 px-3">
            <h1 className="w-3/5 font-bold text-lg text-white leading-tight">
              Hola Nathaly ¿Cómo podemos ayudarte?
            </h1>
          </div>
          <div className="px-3 mt-3 w-full">
            <div className="flex justify-between items-center bg-white rounded-lg p-2 w-full ">
              <div>
                <p className="text-sm">Envíanos un mensaje</p>
                <p className="text-xs">Solemos responder en unas horas</p>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-easywork-main" />
            </div>
          </div>
          <div className="px-3 mt-3 w-full">
            <div className="bg-white flex rounded-lg p-3 justify-between items-center w-full">
              <p className="text-sm">Envíanos un mensaje</p>
              <ArrowTopRightOnSquareIcon className="h-5 w-5 text-easywork-main" />
            </div>
          </div>
          <div className="px-3 mt-3 w-full">
            <div className="bg-white flex rounded-lg p-3 items-center w-full">
              <MagnifyingGlassIcon className="h-5 w-5 text-easywork-main" />
              <p className="text-easywork-main ml-2">Buscar ayuda</p>
            </div>
          </div>
          <div className="w-full bg-white flex justify-around rounded-lg py-1 px-2">
            <div className="text-easywork-main flex flex-col justify-center items-center p-2">
              <HomeIcon className="h-5 w-5" />
              <p className="text-xs font-medium">Inicio</p>
            </div>
            <div className="text-easywork-main flex flex-col justify-center items-center p-2">
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              <p className="text-xs font-medium">Mensaje</p>
            </div>
            <div className="text-easywork-main flex flex-col justify-center items-center p-2">
              <QuestionMarkCircleIcon className="h-5 w-5" />
              <p className="text-xs font-medium">Ayuda</p>
            </div>
            <div className="text-easywork-main flex flex-col justify-center items-center p-2">
              <MegaphoneIcon className="h-5 w-5" />
              <p className="text-xs font-medium">Ayuda</p>
            </div>
          </div>
        </div>
      </Transition>
      <div
        className="size-16 rounded-full bg-green-500 flex justify-center items-center mt-1 cursor-pointer"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Image src="/icons/chatHelp.svg" alt="" width={40} height={40} />
      </div>
    </div>
  );
};

export default HelpChat;
