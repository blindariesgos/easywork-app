"use client";
import { useLeadCancelReazon } from "@/src/lib/api/hooks/leads";
import Button from "../../../../../../../components/form/Button";
import {
  Popover,
  Transition,
  PopoverPanel,
  PopoverButton,
  Field,
  Label,
  Radio,
  RadioGroup,
} from "@headlessui/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { LoadingSpinnerSmall } from "@/src/components/LoaderSpinner";

export default function ButtonDiscardedPolicy({
  selectedReason,
  setSelectedReason,
}) {
  const { t } = useTranslation();
  const { data, isLoading } = useLeadCancelReazon();

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <PopoverButton
            className={`
                        ${open ? "text-white" : "text-white/90"}
                        group inline-flex items-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
          >
            <span>{t("leads:lead:stages:modal:discard")}</span>
          </PopoverButton>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <PopoverPanel className="absolute left-48 z-10 mt-3 w-screen max-w-sm -translate-y-1/2 transform px-4 sm:px-0 ">
              {({ close }) => (
                <div className="overflow-hidden rounded-lg shadow-lg bg-gray-100 p-4">
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
                          <Field
                            key={item.id}
                            className="flex items-center gap-2"
                          >
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
                        close();
                      }}
                      className="px-3 py-2"
                    />
                  </div>
                </div>
              )}
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
