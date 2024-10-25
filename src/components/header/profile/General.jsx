"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ClockIcon,
  CloudIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useNotifyContext } from "@/src/context/notify";
import { BellIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import Image from "next/image";
import SliderOverShord from "@/src/components/SliderOverShort";
import Tag from "@/src/components/Tag";
import { logout } from "../../../lib/apis";

const General = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = new URL(window.location.href);
  const session = useSession();
  const params = new URLSearchParams(searchParams);
  const { setIsOpen } = useNotifyContext();

  params.set("infoP", true);
  
  return (
    <SliderOverShord openModal={params.get("profile")}>
      <Tag onclick={() => router.back()} className="bg-easywork-main" />
      <div className=" bg-gray-600 px-6 py-8 h-screen rounded-l-[35px] w-[567px] shadow-[-3px_1px_15px_4px_#0000003d]">
        <div className="bg-white rounded-md p-2 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              className="h-12 w-12 rounded-full object-cover"
              width={200}
              height={200}
              src={session?.data?.user?.avatar || "/img/avatar.svg"}
              alt=""
            />
            <div className="ml-2 flex flex-col justify-center">
              <p className="text-sm">{session?.data?.user?.name}</p>
              <p className="text-xs">{session?.data?.user?.bio}</p>
            </div>
          </div>
          <button
            onClick={() =>
              router.push(`${url.origin}${url.pathname}?${params.toString()}`)
            }
            className="relative h-9 inline-flex items-center rounded-md bg-primary px-2 text-md font-semibold text-white ring-1 ring-inset ring-indigo-600 hover:bg-indigo-500 focus:z-10"
          >
            Perfil
          </button>
        </div>
        <div
          className="bg-gray-100 rounded-md p-2 flex flex-col justify-between items-center w-full mt-2"
          style={{
            backgroundImage: 'url("/img/backgroundTest/profile.jpeg")',
            backgroundSize: "cover",
          }}
        >
          <div className="flex items-center">
            <div className="rounded-full p-1 bg-easywork-main">
              <CloudIcon className="h-5 w-5 text-white" />
            </div>
            <p className="text-white text-sm ml-2">Temas visuales</p>
          </div>
          <button className="relative text-sm h-9 inline-flex items-center justify-center rounded-md bg-white px-2 text-md font-semibold text-easywork-main ring-1 ring-inset hover:bg-gray-300 focus:z-10 mt-2 w-full text-center">
            Cambiar
          </button>
        </div>
        <div className="flex mt-2 justify-between">
          <div className="bg-white rounded-md p-2 flex justify-between items-center w-8/12 h-40">
            <div className="w-8/12 mr-1">
              <p>Inicio de sesión por teléfono</p>
              <button className="relative mt-5 h-7 inline-flex items-center rounded-md bg-primary px-2 text-md text-white ring-1 ring-inset ring-indigo-600 hover:bg-indigo-500 focus:z-10">
                Mostrar código QR
              </button>
            </div>
            <div className="w-4/12 bg-gray-100 h-full flex justify-center items-center">
              <Image
                className="h-24 w-24"
                width={100}
                height={100}
                src={"/img/backgroundTest/qrcode_app.easywork.com.mx.png"}
                alt="qr"
              />
            </div>
          </div>
          <div className="bg-white rounded-md p-2 flex flex-col justify-evenly items-center w-4/12 ml-2 h-40">
            <div className="p-2 rounded-full bg-gray-200">
              <Image
                className="h-7 w-7"
                width={100}
                height={100}
                src={"/img/window.png"}
                alt="qr"
              />
            </div>
            <p>Easywork</p>
            <p>Para Windows</p>
            <button className="relative w-full justify-center mt-5 h-7 inline-flex items-center rounded-md bg-primary px-2 text-md text-white ring-1 ring-inset ring-indigo-600 hover:bg-indigo-500 focus:z-10">
              Instalar
            </button>
          </div>
        </div>
        <div className="bg-white rounded-md p-2 flex items-center mt-2">
          <ClockIcon className="h-5 w-5" />
          <p className="ml-2">Historial de acceso</p>
        </div>
        <div className="mt-2 flex justify-evenly">
          <button
            className="relative h-9 inline-flex items-center rounded-md bg-primary px-2 text-md font-semibold text-white ring-1 ring-inset ring-indigo-600 hover:bg-indigo-500 focus:z-10"
            onClick={() => {
              router.back();
              setIsOpen(true);
            }}
          >
            <BellIcon className="h-4 w-4 text-white mr-1" />
            Notificaciones
          </button>
          <button
            className="relative h-9 inline-flex items-center rounded-md bg-gray-50 px-2 text-md font-semibold text-white ring-1 ring-inset hover:bg-gray-60 focus:z-10"
            onClick={() => logout()}
          >
            <ArrowRightStartOnRectangleIcon className="h-4 w-4 text-white mr-1" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </SliderOverShord>
  );
};

export default General;
