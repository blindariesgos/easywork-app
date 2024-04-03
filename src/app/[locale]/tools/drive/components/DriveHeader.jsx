import React from "react";
import CreateDocumentButton from "./CreateDocument";
import { Cog8ToothIcon, TrashIcon } from "@heroicons/react/20/solid";
import DriveBreadcrumb from "./DriveBreadcrumb";

export default function DriveHeader() {
  return (
    <header className="flex flex-col">
      <div className="lg:px-6 px-2 flex gap-3 items-center bg-white py-4 rounded-md">
        <h1 className="text-2xl font-semibold leading-6 text-gray-900 hidden md:block">
          Drive-Documentos
        </h1>
        <CreateDocumentButton />
        <div className="flex-grow">
          <label htmlFor="search" className="sr-only">
            search
          </label>
          <input
            type="search"
            name="search"
            id="search-cal"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Filtrar y Buscar"
          />
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <TrashIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <Cog8ToothIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex-none items-center justify-between border-b border-gray-200 py-4 hidden lg:flex">
        <DriveBreadcrumb />
      </div>
    </header>
  );
}
