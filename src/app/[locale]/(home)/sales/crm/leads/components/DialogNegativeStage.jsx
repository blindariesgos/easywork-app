"use Client";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
  Field,
  Label,
  Radio,
  RadioGroup,
} from "@headlessui/react";
import { useLeadCancelReazon } from "@/src/lib/api/hooks/leads";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { LoadingSpinnerSmall } from "@/src/components/LoaderSpinner";
import Button from "../../../../../../../components/form/Button";

export default function DialogNegativeStage({
  isOpen,
  setIsOpen,
  setSelectedReason,
  selectedReason,
}) {
  const { t } = useTranslation();
  const { data, isLoading } = useLeadCancelReazon();

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
                {isLoading && <LoadingSpinnerSmall />}
                <div className="py-4">
                  <RadioGroup
                    value={selectedReason}
                    onChange={setSelectedReason}
                    aria-label="Server size"
                  >
                    {data &&
                      data.length > 0 &&
                      data.map((item) => (
                        <Field
                          key={item.id}
                          className="flex items-center gap-2"
                        >
                          <Radio
                            value={item.id}
                            className="group flex size-5 items-center cursor-pointer justify-center rounded-full border bg-white data-[checked]:bg-primary"
                          >
                            <span className="invisible size-2 rounded-full bg-white group-data-[checked]:visible" />
                          </Radio>
                          <Label>{item.name}</Label>
                        </Field>
                      ))}
                  </RadioGroup>
                </div>
                <div className="flex justify-center gap-4 sticky bottom-0 pt-4 pb-2">
                  <Button
                    type="submit"
                    label={t("common:buttons:save")}
                    buttonStyle="primary"
                    className="px-3 py-2"
                  />
                  <Button
                    type="button"
                    label={t("common:buttons:cancel")}
                    buttonStyle="secondary"
                    onclick={() => {
                      setSelectedReason([]);
                      closeModal();
                    }}
                    className="px-3 py-2"
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
