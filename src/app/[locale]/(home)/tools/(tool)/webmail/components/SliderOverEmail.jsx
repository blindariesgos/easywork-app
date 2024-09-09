"use client";
import useAppContext from "../../../../../../../context/app";
import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function SliderOverEmail({ openModal, setOpenModal, children }) {
  const { t } = useTranslation();
  const { sidebarOpenEmail, setSidebarOpenEmail } = useAppContext();
  return (
    <Transition.Root show={sidebarOpenEmail} as={Fragment}>
      <div className="relative z-50">
        {window.innerWidth > 1023 ? (
          ""
        ) : (
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed right-0 inset-0 bg-gray-900/80">
              <button
                type="button"
                className="absolute right-6 top-10"
                onClick={() => setSidebarOpenEmail(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
          </Transition.Child>
        )}

        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-500 sm:duration-700"
          enterFrom="-translate-x-80"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-500 sm:duration-700"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-80"
        >
          <div
            className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-easy-1000 to-primary pb-4 rounded-tr-[50px] rounded-br-[50px] 
                          fixed inset-y-0 bg-white left-0 w-80"
          >
            <div className="pointer-events-auto w-auto">
              <div className="flex b-gray-300 h-16 shrink-0 items-center mx-auto mt-10">
                {children}
              </div>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition.Root>
  );
}
