import React from "react";
import { FolderIcon } from "@heroicons/react/20/solid";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

export default function Page() {
  return (
    <div className="mb-2">
      <div className="bg-white grid grid-cols-3 gap-4 p-5">
        <div className="bg-neutral-200 min-w-48 w-96 min-h-32 h-52 rounded-md flex justify-center items-center">
          <div className="flex flex-col items-center">
            <FolderIcon className="h-24 w-24 text-easywork-main" />
            <p>Carpeta de tal cosa</p>
          </div>
        </div>
        <div className="bg-neutral-200 min-w-48 w-96 min-h-32 h-52 rounded-md flex justify-center items-center">
          <div className="flex flex-col items-center">
            <FolderIcon className="h-24 w-24 text-easywork-main" />
            <p>Carpeta de tal cosa</p>
          </div>
        </div>
        <div className="bg-neutral-200 min-w-48 w-96 min-h-32 h-52 rounded-md flex justify-center items-center">
          <div className="flex flex-col items-center">
            <FolderIcon className="h-24 w-24 text-easywork-main" />
            <p>Carpeta de tal cosa</p>
          </div>
        </div>
        <div className="bg-neutral-200 min-w-48 w-96 min-h-32 h-52 rounded-md flex justify-center items-center">
          <div className="flex flex-col items-center">
            <FolderIcon className="h-24 w-24 text-easywork-main" />
            <p>Carpeta de tal cosa</p>
          </div>
        </div>
        <div className="bg-neutral-200 min-w-48 w-96 min-h-32 h-52 rounded-md flex justify-center items-center">
          <div className="flex flex-col items-center">
            <FolderIcon className="h-24 w-24 text-easywork-main" />
            <p>Carpeta de tal cosa</p>
          </div>
        </div>
        <div className="bg-neutral-200 min-w-48 w-96 min-h-32 h-52 rounded-md flex justify-center items-center">
          <div className="flex flex-col items-center">
            <FolderIcon className="h-24 w-24 text-easywork-main" />
            <p>Carpeta de tal cosa</p>
          </div>
        </div>
        <div className="bg-neutral-200 min-w-48 w-96 min-h-32 h-52 rounded-md flex justify-center items-center">
          <div className="flex flex-col items-center">
            <FolderIcon className="h-24 w-24 text-easywork-main" />
            <p>Carpeta de tal cosa</p>
          </div>
        </div>
        <div className="bg-neutral-200 min-w-48 w-96 min-h-32 h-52 rounded-md flex justify-center items-center">
          <div className="flex flex-col items-center">
            <FolderIcon className="h-24 w-24 text-easywork-main" />
            <p>Carpeta de tal cosa</p>
          </div>
        </div>
      </div>
      <div className="flex bg-white w-full pb-2">
        <div className="ml-6">Seleccionado: 0/50</div>
        <div className="ml-6">Pagina 1/2</div>
        <div className="ml-6">
          <div className="flex items-center ">
            <div className="flex">
              <ChevronLeftIcon className="h-6 w-6 mr-2 text-easywork-main" />
              anterior
            </div>
            <div className="ml-4 flex">
              siguiente
              <ChevronRightIcon className="h-6 w-6 ml-2 text-easywork-main" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
