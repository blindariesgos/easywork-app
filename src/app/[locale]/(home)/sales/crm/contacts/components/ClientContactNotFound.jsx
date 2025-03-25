import React, { useState } from "react";

import Button from "@/src/components/form/Button";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useRouter } from "next/navigation";

export default function ClientContactNotFound({ isOpen, setIsOpen }) {
  const router = useRouter();

  const handleClick = () => {
    setIsOpen(false);
    router.push("/sales/crm/contacts/contact?show=true&type=fisica");
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-[10000]"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <DialogPanel className="max-w-sm space-y-4 bg-white p-4 rounded-xl">
          <DialogTitle>{"Cliente contacto no encontrado"}</DialogTitle>

          <div className="flex justify-center gap-4">
            <Button
              label="Cancelar"
              buttonStyle="secondary"
              className="px-4 py-2 "
              onclick={() => setIsOpen(false)}
            />
            <Button
              label={"Crear cliente contacto"}
              buttonStyle="primary"
              className="px-4 py-2 "
              onclick={handleClick}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
