"use client";
import clsx from "clsx";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  Fragment,
  useCallback,
} from "react";

import LoaderSpinner from "@/src/components/LoaderSpinner";
import Button from "@/src/components/form/Button";
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import SelectDropdown from "../form/SelectDropdown";
import { useTranslation } from "react-i18next";
import useAppContext from "@/src/context/app";

export default function SelectUserModal({
  isOpen,
  setIsOpen,
  handleClick,
  loading,
  title,
}) {
  const { t } = useTranslation();
  const { lists } = useAppContext();
  const schema = Yup.object().shape({
    developmentManager: Yup.string(),
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isValid, errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleFormSubmit = async (data) => {
    console.log("Lpaaaaaaaaaaaaa");
    handleClick(data?.developmentManager);
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen()} className="relative z-50">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <DialogPanel className="max-w-lg space-y-8 bg-white p-12 rounded-xl">
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <DialogTitle className="font-bold text-xl text-center">
              {title}
            </DialogTitle>
            <div className="p-4">
              <SelectDropdown
                label={t("agentsmanagement:accompaniments:agent:manager")}
                name="developmentManager"
                options={lists?.users ?? []}
                error={errors?.developmentManager}
                setValue={setValue}
                watch={watch}
              />
            </div>
            <div className="flex justify-center gap-4">
              <Button
                label="Cancelar"
                buttonStyle="secondary"
                className="px-4 py-2"
                onclick={() => setIsOpen()}
              />
              <Button
                label={"Asignar"}
                buttonStyle="primary"
                className="px-4 py-2 "
                type="submit"
              />
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
