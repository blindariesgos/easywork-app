"use client";
import { useSession } from "next-auth/react";
import {
  XMarkIcon,
  ChevronRightIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
const MessagesChat = ({setWindow}) => {
  const session = useSession();
  return (
    <div className="w-full flex items-center flex-col">
      <div className="w-full flex justify-center bg-easywork-main rounded-t-lg text-white py-2">
        <h1>Mensajes</h1>
      </div>
      <div className="w-full flex items-center flex-col overflow-y-auto h-72">
        {[
          {
            title: "Activacion de doble factor de seguridad...",
            time: "Soporte hace - 1 dia",
          },
          {
            title: "Activacion de doble factor de seguridad...",
            time: "Soporte hace - 1 dia",
          },
          {
            title: "Activacion de doble factor de seguridad...",
            time: "Soporte hace - 1 dia",
          },
          {
            title: "Activacion de doble factor de seguridad...",
            time: "Soporte hace - 1 dia",
          },
          {
            title: "Activacion de doble factor de seguridad...",
            time: "Soporte hace - 1 dia",
          },
          {
            title: "Activacion de doble factor de seguridad...",
            time: "Soporte hace - 1 dia",
          },
          {
            title: "Activacion de doble factor de seguridad...",
            time: "Soporte hace - 1 dia",
          },
        ].map((item, index) => (
          <div className="p-2 flex justify-between items-center" key={index} onClick={() => setWindow(3)}>
            <div className="flex items-center">
              <div className="rounded-full bg-gray-50 size-10"></div>
            </div>
            <div className="ml-1">
              <h1 className="text-sm font-semibold">{item.title}</h1>
              <p className="text-xs">{item.time}</p>
            </div>
            <ChevronRightIcon className="w-6 h-6 text-easywork-main" />
          </div>
        ))}
        <button className="text-easywork-main py-1 px-2 rounded-full border flex mt-1 text-sm font-medium items-center hover:text-white hover:bg-easywork-main">
          Envíanos un mensaje <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MessagesChat;
