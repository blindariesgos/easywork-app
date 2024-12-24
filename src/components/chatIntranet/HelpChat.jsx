"use client";
import Image from "next/image";
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import HomeChat from "./Home";
import MessagesChat from "./MessagesChat";
import HistoryChat from "./HistoryChat";

const HelpChat = () => {
  const [open, setOpen] = useState(false);
  const [window, setWindow] = useState(1);

  return (
    <div className="fixed bottom-3 right-3 flex flex-row items-end space-y-2">
      <div className="w-full flex justify-end mr-1 mb-12">
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
          <div
            className={`bg-gradient-to-r ${
              window === 1 ? "from-green-600 to-green-500" : "bg-white"
            } w-72 h-96 rounded-lg flex flex-col items-center justify-between`}
          >
            {window === 1 && <HomeChat />}
            {window === 2 && <MessagesChat setWindow={setWindow} />}
            {window === 3 && <HistoryChat />}
            <div className="w-full bg-white flex justify-around rounded-lg py-1 px-2">
              <div
                className="text-easywork-main flex flex-col justify-center cursor-pointer items-center p-2"
                onClick={() => setWindow(1)}
              >
                <HomeIcon className="h-5 w-5" />
                <p className="text-xs font-medium">Inicio</p>
              </div>
              <div
                className="text-easywork-main flex flex-col justify-center cursor-pointer items-center p-2"
                onClick={() => setWindow(2)}
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                <p className="text-xs font-medium">Mensaje</p>
              </div>
              <div
                className="text-easywork-main flex flex-col justify-center cursor-pointer items-center p-2"
                onClick={() => setWindow(4)}
              >
                <QuestionMarkCircleIcon className="h-5 w-5" />
                <p className="text-xs font-medium">Ayuda</p>
              </div>
              <div
                className="text-easywork-main flex flex-col justify-center cursor-pointer items-center p-2"
                onClick={() => setWindow(5)}
              >
                <MegaphoneIcon className="h-5 w-5" />
                <p className="text-xs font-medium">Ayuda</p>
              </div>
            </div>
          </div>
        </Transition>
      </div>
      <div className="w-full flex justify-end">
        <div
          className="size-16 rounded-full bg-green-500 flex justify-center items-center cursor-pointer"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <Image src="/icons/chatHelp.svg" alt="support" width={40} height={40} />
        </div>
      </div>
    </div>
  );
};

export default HelpChat;
