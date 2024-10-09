"use client";
import {
  DocumentTextIcon,
  PhotoIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";

export function DocumentSelector({
  onChange,
  files,
  disabled,
  setFiles,
  ...props
}) {
  const { t } = useTranslation();

  const handleDrop = (event) => {
    event.preventDefault();
    onChange(event, true);
  };

  const deleteDocument = (indexToDelete) => {
    const documents = files.filter((item, index) => index !== indexToDelete);
    setFiles(documents);
  };

  return (
    <div className="col-span-full pt-2">
      <label
        htmlFor="cover-photo"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {t("contacts:create:passport")}
      </label>
      <div
        className=" rounded-lg border border-dashed border-gray-900/25 py-6 px-2 relative w-full"
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        {disabled && (
          <div className="inset-0 bg-white/75 w-full h-full z-10 absolute rounded-tr-lg" />
        )}
        <div className="grid grid-cols-3 gap-x-2">
          {files.length > 0 &&
            files.map((file, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="flex">
                  <DocumentTextIcon className="h-10 w-10 text-primary" />
                  <div
                    onClick={() => deleteDocument(index)}
                    className="cursor-pointer"
                  >
                    <XCircleIcon className="h-3 w-3 text-primary" />
                  </div>
                </div>
                <p className="text-[10px]">{file.name}</p>
              </div>
            ))}
        </div>
        {files.length === 0 && (
          <div className="flex justify-center">
            <PhotoIcon
              className=" h-12 w-12 text-gray-300"
              aria-hidden="true"
            />
          </div>
        )}
        <div className="text-center pt-4">
          <div className=" flex text-sm leading-6 text-gray-600 justify-center">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-zinc-100 font-semibold text-primary focus-within:outline-none  focus-within:ring-primary  hover:text-indigo-600 outline-none focus:ring-0 focus-within:ring-0"
            >
              <span>{t("contacts:create:upload-file")}</span>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(event) => onChange(event)}
                id="file-upload"
                className="sr-only outline-none focus:ring-0"
                multiple
                disabled={disabled}
                {...props}
              />
            </label>
            <p className="pl-1">{t("contacts:create:drap-drop")}</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">
            {t("contacts:create:png")}
          </p>
        </div>
      </div>
      {/* {files.length === 0 && <p className="mt-1 text-xs text-red-600">{t('common:validations:file')}</p>} */}
    </div>
  );
}
