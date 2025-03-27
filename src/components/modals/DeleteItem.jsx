"use client";

import React from "react";

import Button from "@/src/components/form/Button";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

export default function DeleteModal({
  isOpen,
  setIsOpen,
  handleClick,
  loading,
  title,
}) {
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
        <DialogPanel className="max-w-lg space-y-8 bg-white p-12 rounded-xl">
          <DialogTitle className="font-bold text-xl text-center">
            {title ?? "¿Desea eliminar?"}
          </DialogTitle>
          <div className="flex justify-center gap-4">
            <Button
              label={loading ? "Eliminando..." : "Eliminar"}
              buttonStyle="error"
              className="px-4 py-2"
              onclick={handleClick}
              disabled={loading}
            />
            <Button
              label="Cancelar"
              buttonStyle="secondary"
              className="px-4 py-2"
              onclick={() => setIsOpen(false)}
              disabled={loading}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
