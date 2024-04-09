"use client";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import Tag from "./Tag";

export default function SliderOverShort({ openModal, setOpenModal, children }) {
  const { t } = useTranslation();

  return (
    <Transition.Root show={openModal} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex pl-0' sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-auto">  {/*w-max-full md:max-w-4xl lg:max-w-4xl xl:max-w-7xl*/}
                  <div className="flex b-gray-300">
                    <Tag
                      onclick={() => setOpenModal(false)} 
                      className="bg-green-500"
                    />
                    {children}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
