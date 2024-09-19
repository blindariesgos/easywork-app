"use Client";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonGeneratePolicy from "./ButtonGeneratePolicy";
import ButtonDiscardedPolicy from "./ButtonDiscardedPolicy";

export default function DialogPositiveStage({
  isOpen,
  setIsOpen,
  setSelectedReason,
  selectedReason,
}) {
  const { t } = useTranslation();
  const generatePolicy = [
    {
      id: 1,
      name: t("leads:lead:stages:modal:positive:policyContact"),
    },
    {
      id: 2,
      name: t("leads:lead:stages:modal:positive:contact"),
    },
    {
      id: 3,
      name: t("leads:lead:stages:modal:positive:company"),
    },
    {
      id: 4,
      name: t("leads:lead:stages:modal:positive:policy"),
    },
  ];

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[10000]" onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform rounded-2xl bg-gray-100 p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-black"
                >
                  {t("leads:lead:stages:modal:select")}
                </DialogTitle>
                <div className="flex gap-2 justify-center mt-6">
                  <ButtonGeneratePolicy
                    label={t("leads:lead:stages:modal:policy")}
                    options={generatePolicy}
                  />
                  <ButtonDiscardedPolicy
                    setSelectedReason={setSelectedReason}
                    selectedReason={selectedReason}
                  />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
