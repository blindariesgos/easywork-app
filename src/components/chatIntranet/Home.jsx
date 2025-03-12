"use client";
import { useSession } from "next-auth/react";
import {
  XMarkIcon,
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
const HomeChat = () => {
  const session = useSession();
  return (
    <div className="pt-3">
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
          Hola {session?.data.user.profile.firstName} ¿Cómo podemos ayudarte?
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
    </div>
  );
};

export default HomeChat;
