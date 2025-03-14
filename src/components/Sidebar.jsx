"use client";
import { Fragment } from "react";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import useAppContext from "../context/app/index";
import Link from "next/link";
import SidebarMenu from "./SidebarMenu";
import { useTranslation } from "react-i18next";
import LoaderSpinner from "./LoaderSpinner";

export default function Sidebar() {
  const {
    sidebarOpen,
    setSidebarOpen,
    setSidebarOpenDesktop1,
    setSidebarOpenDesktop2,
    sidebarOpenDesktop1,
    sidebarOpenDesktop2,
  } = useAppContext();
  const { t } = useTranslation();
  const { loading } = useAppContext();

  return (
    <>
      {loading && <LoaderSpinner />}
      <Transition show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </TransitionChild>

          <div className="fixed inset-0 flex">
            <TransitionChild
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                <TransitionChild
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </TransitionChild>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-easy-1000 to-primary px-6 pb-4 ring-1 ring-white/10 rounded-tr-[50px] rounded-br-[50px]">
                  <div className="flex h-16 shrink-0 items-center">
                    <Image
                      width={32}
                      height={32}
                      className="h-8 w-auto"
                      src="/img/Layer_2.svg"
                      alt="Your Company"
                    />
                  </div>
                  <SidebarMenu />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
      {/* <div
        className={`hidden lg:z-50 lg:flex lg:flex-col h-screen transition-all duration-300 ${sidebarOpenDesktop2 ? "lg:w-96" : "lg:w-24"
          }`}
      ></div> */}
      <div
        onMouseEnter={() => {
          if (!sidebarOpenDesktop1) {
            setSidebarOpenDesktop1(true);
          }
        }}
        onMouseLeave={() => {
          if (sidebarOpenDesktop1 && !sidebarOpenDesktop2) {
            setSidebarOpenDesktop1(false);
          }
        }}
        className={`hidden fixed lg:z-50 lg:flex lg:flex-col h-screen transition-all duration-300 ${
          sidebarOpenDesktop1 ? "lg:w-72" : "lg:w-24"
        }`}
      >
        <div
          className={`flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-easy-1000 to-primary px-4 pb-4 rounded-tr-[50px] rounded-br-[50px] ${
            sidebarOpenDesktop1 && !sidebarOpenDesktop2
              ? "hover:opacity-85"
              : "opacity-100"
          }`}
        >
          <div className="flex h-16 shrink-0 items-center mx-auto mt-10">
            <Link href="/home">
              <Image
                width={72}
                height={72}
                className="h-16 w-auto"
                src="/img/Layer_2.svg"
                alt="EasyWork"
              />
            </Link>
          </div>
          <SidebarMenu />
        </div>
      </div>
    </>
  );
}
