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
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import SelectInput from "@/src/components/form/SelectInput";

export default function TaskConfigDuplicates({ isOpen, setIsOpen }) {
  const [selected, setSelected] = useState({ id: "1", name: "Diariamente" });
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
        <DialogPanel className="max-w-lg space-y-4 bg-white p-4 rounded-xl">
          <DialogTitle>{"Búsqueda automática de duplicados"}</DialogTitle>
          <div className="p-3 bg-[#F2F6F7] rounded-lg">
            <p className="text-sm pb-2">
              El sistema intentará buscar y fusionar los duplicados de acuerdo
              con las opciones seleccionadas.
            </p>
            <SelectInput
              label={"Ejecutar el buscador de duplicados"}
              options={[
                { id: "1", name: "Diariamente" },
                { id: "2", name: "Una vez a la semana" },
                { id: "3", name: "Una vez cada dos semanas" },
                { id: "4", name: "Una vez al mes" },
                { id: "5", name: "Una vez cada seis meses" },
                { id: "6", name: "Nunca" },
              ]}
              setSelectedOption={setSelected}
            />
          </div>
          <div className="flex justify-center gap-4">
            <Button
              label={"Guardar"}
              buttonStyle="primary"
              className="px-4 py-2 "
              onclick={() => setIsOpen(false)}
            />
            <Button
              label="Cancelar"
              buttonStyle="secondary"
              className="px-4 py-2 "
              onclick={() => setIsOpen(false)}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
