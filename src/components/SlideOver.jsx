"use client";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import Tag from "./Tag";
import useAppContext from "@/context/app";
import { useRouter } from "next/navigation";

export default function SlideOver({ openModal, setOpenModal, children, colorTag, labelTag }) {
  const { t } = useTranslation();
  const router = useRouter()
  const { showContact, setShowContact, contactDetailTab } = useAppContext();
  const [label, setLabel] = useState("");

  // useEffect(() => {
  //   setShowContact(openModal)
  // }, [openModal, setShowContact])

  useEffect(() => {
    switch (labelTag) {
      case "contact":
        setLabel(t('contacts:header:contact'))
        break;
      case "policy":
        setLabel(t('contacts:create:tabs:policies'))
        break;
      
    
      default:
        break;
    }
  }, [labelTag])
  


  return (
    <Transition.Root show={openModal} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0' sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen">
                  <div className="flex">
                    <Tag
                      title={label}
                      onclick={() => {setOpenModal ? setOpenModal(false) : router.back()}} 
                      className={colorTag}
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
