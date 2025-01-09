"use client";
import Image from "next/image";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import HistoryChat from "./HistoryChat";
import { motion } from "framer-motion";

const HelpChat = () => {
  const [open, setOpen] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  const toggleOpen = () => setOpen(!open);
  const toggleOpenChat = () => setOpenChat(!openChat);

  return (
    <div className="fixed bottom-3 right-3 flex flex-row items-end space-y-2 z-40">
      <div className="w-full flex justify-end mr-1 mb-12">
        <Transition
          show={openChat}
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
            onMouseEnter={toggleOpenChat}
            onMouseLeave={toggleOpenChat}
            onClick={toggleOpenChat} // Para dispositivos táctiles
          >
            <HistoryChat />
          </div>
        </Transition>
      </div>
      <motion.div
        className="w-full flex flex-col items-center"
        onHoverStart={() => setOpen(true)}
        onHoverEnd={() => setOpen(false)}
        onClick={toggleOpen} // Para alternar en pantallas táctiles
      >
        {/* Botón 1 */}
        <a
          href="https://www.whatsapp.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <motion.div
            className="size-16 rounded-full bg-lime-400 flex justify-center items-center cursor-pointer opacity-80 mb-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: open ? 1 : 0,
              y: open ? 0 : 30,
            }}
            transition={{ duration: 0.5 }}
            whileHover={{
              scale: 1.1,
            }}
            whileTap={{ scale: 1.1 }}
          >
            <Image
              src="/img/landing/whatsappWhite.png"
              alt="support"
              width={32}
              height={32}
            />
          </motion.div>
        </a>

        {/* Botón 2 */}
        <motion.div
          className="size-16 rounded-full bg-easywork-main flex justify-center items-center cursor-pointer opacity-80 mb-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: open ? 1 : 0,
            y: open ? 0 : 30,
          }}
          transition={{ duration: 0.5 }}
          onMouseEnter={toggleOpenChat}
          onMouseLeave={toggleOpenChat}
          onClick={toggleOpenChat} // Para alternar en pantallas táctiles
          whileHover={{
            scale: 1.1,
          }}
          whileTap={{ scale: 1.1 }}
        >
          <ChatBubbleLeftRightIcon className="w-10 h-10 text-white" />
        </motion.div>

        {/* Botón que desencadena la animación */}
        <motion.div
          className="size-16 rounded-full bg-cyan-500 flex justify-center items-center cursor-pointer opacity-80"
          whileHover={{
            scale: 1.1,
          }}
          whileTap={{ scale: 1.1 }}
          onClick={toggleOpen} // Para alternar en pantallas táctiles
        >
          <Image
            src="/img/landing/sms.svg"
            alt="support"
            width={32}
            height={32}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HelpChat;
