import { Button, Dialog, DialogPanel } from "@tremor/react";
import React, { useState } from "react";
import { useDataContext } from "../context";
import { CheckIcon } from "@heroicons/react/20/solid";

export function DialogSuccess({ children, isOpen, callback }) {
  const { contextData, setContextData } = useDataContext();
  return (
    <>
      {children}
      <Dialog open={isOpen} onClose={(val) => callback(val)} static={true}>
        <DialogPanel className="w-80 bg-gray-100">
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center w-80">
              <CheckIcon className="text-easywork-main h-10 w-10" />
              <p className="mt-2 leading-6 text-black text-2xl text-center mb-6">
                Cambio de contraseña realizado con éxito.
              </p>
              <Button
                style={{ backgroundColor: "#262261" }}
                className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                onClick={() => {
                  setContextData(0);
                  callback(false);
                }}
              >
                Continuar
              </Button>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
}
