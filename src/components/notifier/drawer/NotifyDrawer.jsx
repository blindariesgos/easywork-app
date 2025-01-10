"use client";
import { useNotifyContext } from "@/src/context/notify";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import NotifyList from "./NotifyList";
import clsx from "clsx";

export default function NotifyDrawer() {
  const { isOpen, setIsOpen } = useNotifyContext();

  return (
    <Dialog className="relative z-10" open={isOpen} onClose={setIsOpen}>
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-screen max-w-2xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <TransitionChild>
                <div className="absolute left-0 top-7 rounded-l-lg -ml-8 flex justify-center items-center pr-3 py-1 bg-easywork-main duration-500 ease-in-out data-[closed]:opacity-0 sm:-ml-10 sm:pr-4">
                  <button
                    type="button"
                    className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="absolute -inset-2.5" />
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <div
                className={clsx(
                  "flex h-full divide-y divide-slate-400 flex-col overflow-y-scroll rounded-tl-[35px] rounded-bl-[35px] py-6 shadow-xl",
                  {
                    "bg-[url('/img/fondo-home.png')]": false,
                    "bg-white": true,
                  }
                )}
              >
                <div className="px-4 sm:px-6">
                  <DialogTitle className="text-base font-semibold leading-6 text-gray-900 flex gap-2 items-center ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-5 w-8 h-8 text-slate-800"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 2a6 6 0 0 0-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 0 0 .515 1.076 32.91 32.91 0 0 0 3.256.508 3.5 3.5 0 0 0 6.972 0 32.903 32.903 0 0 0 3.256-.508.75.75 0 0 0 .515-1.076A11.448 11.448 0 0 1 16 8a6 6 0 0 0-6-6ZM8.05 14.943a33.54 33.54 0 0 0 3.9 0 2 2 0 0 1-3.9 0Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <div className="text-lg">Notificaciones</div>
                  </DialogTitle>
                </div>
                <div className="relative mt-6 flex-1 px-2 sm:px-4">
                  <NotifyList />
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
