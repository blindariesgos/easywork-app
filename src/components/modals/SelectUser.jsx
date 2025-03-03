"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Button from "@/src/components/form/Button";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import SelectDropdown from "../form/SelectDropdown";
import { useTranslation } from "react-i18next";
import useAppContext from "@/src/context/app";
import UserSelectAsync from "../form/UserSelectAsync";

export default function SelectUserModal({
  isOpen,
  setIsOpen,
  handleClick,
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
              <UserSelectAsync
                label={t("agentsmanagement:accompaniments:agent:manager")}
                name="developmentManager"
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
