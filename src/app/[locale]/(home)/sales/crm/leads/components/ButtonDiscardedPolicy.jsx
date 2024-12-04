"use client";
import { useLeadCancelReazon } from "@/src/lib/api/hooks/leads";
import Button from "../../../../../../../components/form/Button";
import { PiWarningLight } from "react-icons/pi";
import {
  Field,
  Label,
  Radio,
  RadioGroup,
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { LoadingSpinnerSmall } from "@/src/components/LoaderSpinner";

export default function ButtonDiscardedPolicy({
  selectedReason,
  setSelectedReason,
  handleSubmit,
}) {
  const { t } = useTranslation();
  const { data, isLoading } = useLeadCancelReazon();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenReazons, setIsOpenReazons] = useState(false);
  return (
    <Fragment>
      <button
        className={`text-white group inline-flex items-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
        onClick={() => setIsOpen(true)}
      >
        <span>{t("leads:lead:stages:modal:discard")}</span>
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-[20000]"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 bg-white p-8 rounded-2xl">
            <div className="flex justify-center">
              <PiWarningLight className="w-20 h-20 text-yellow-600" />
            </div>
            <DialogTitle className="font-bold">
              ¿Esta seguro que quiere descartar al prospecto?
            </DialogTitle>
            <Description>
              Si lo descarta no podrá activarlo nuevamente.
            </Description>
            <div className="flex gap-4 justify-end">
              <Button
                buttonStyle="secondary"
                className="px-3 py-2"
                label={"No, cancelar"}
                type={"button"}
                onclick={() => setIsOpen(false)}
              />
              <Button
                buttonStyle="primary"
                className="px-3 py-2"
                type={"button"}
                label={"Si, descartar"}
                onclick={() => {
                  setIsOpen(false);
                  setIsOpenReazons(true);
                }}
              />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      <Dialog
        open={isOpenReazons}
        onClose={() => setIsOpenReazons(false)}
        className="relative z-[20000]"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg  bg-white p-8 rounded-2xl shadow-lg">
            <p className="textsm text-black font-medium">
              {t("leads:lead:stages:modal:select")}
            </p>
            <div className="relative grid gap-2 bg-white px-2 sm:px-4 grid-cols-1 mt-4 py-4">
              {isLoading && <LoadingSpinnerSmall />}
              <RadioGroup
                value={selectedReason}
                onChange={setSelectedReason}
                aria-label="Server size"
              >
                {data &&
                  data.length > 0 &&
                  data.map((item) => (
                    <Field key={item.id} className="flex items-center gap-2">
                      <Radio
                        value={item.id}
                        className="group flex size-5 items-center justify-center rounded-full border bg-white data-[checked]:bg-primary"
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
                type="button"
                label={t("common:buttons:cancel")}
                buttonStyle="secondary"
                onclick={() => {
                  setSelectedReason([]);
                  setIsOpenReazons(false);
                }}
                className="px-3 py-2"
              />
              <Button
                onclick={handleSubmit}
                label={t("common:buttons:save")}
                buttonStyle="primary"
                className="px-3 py-2"
              />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Fragment>
  );
}
