"use client";
import clsx from "clsx";

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

export default function DeleteModal({ isOpen, setIsOpen, handleClick }) {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <DialogPanel className="max-w-lg space-y-8 bg-white p-12 rounded-xl">
          <DialogTitle className="font-bold text-xl text-center">
            ¿Desea eliminar?
          </DialogTitle>
          <div className="flex justify-center gap-4">
            <Button
              label="Eliminar"
              buttonStyle="error"
              className="px-4 py-2 text-xl"
              onclick={handleClick}
            />
            <Button
              label="Cancelar"
              buttonStyle="secondary"
              className="px-4 py-2 text-xl"
              onclick={() => setIsOpen(false)}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
