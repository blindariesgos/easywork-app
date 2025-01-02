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
import HistoryChat from "./HistoryChat";
import Whatsapp from "./Whatsapp";

const HelpChat = () => {
  const [open, setOpen] = useState(false);
  const [window, setWindow] = useState(1);

  return (
    <div className="fixed bottom-3 right-3 flex flex-row items-end space-y-2 z-40">
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
            className={`bg-gradient-to-r bg-white w-72 h-96 rounded-lg flex flex-col items-center justify-between`}
          >
            {window === 1 && <HistoryChat />}
            {window === 2 && <Whatsapp />}
            <div className="w-full bg-white flex justify-around rounded-lg py-1 px-2">
              <div
                className="text-easywork-main flex flex-col justify-center cursor-pointer items-center p-2"
                onClick={() => setWindow(1)}
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
              </div>
              <div
                className="text-easywork-main flex flex-col justify-center cursor-pointer items-center p-2"
                onClick={() => setWindow(2)}
              >
                <Image
                  src="/img/landing/whatsapp.png"
                  alt="whatsapp"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>
        </Transition>
      </div>
      <div className="w-full flex justify-end">
        <div
          className="size-20 rounded-full bg-cyan-500 flex justify-center items-center cursor-pointer opacity-80"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <Image
            src="/img/landing/sms.svg"
            alt="support"
            width={40}
            height={40}
          />
        </div>
      </div>
    </div>
  );
};

export default HelpChat;
