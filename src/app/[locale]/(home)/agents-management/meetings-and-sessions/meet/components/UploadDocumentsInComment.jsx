"use client";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useSWRConfig } from "swr";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { uploadTemporalFile } from "../../../../../../../lib/api/drive";

export default function UploadDocumentInComment({ handleChangeFiles }) {
  const { t } = useTranslation();
  const inputFileRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleFilesUpload = async (event) => {
    setLoading(true);
    const fileList = Array.from(event.target.files);

    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file, file.name);
    });

    const files = fileList.map((file) => {
      const blob = new Blob([file], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      return { blob: url, file };
    });

    const response = await uploadTemporalFile(formData)
      .then((ids) => ({ ids }))
      .catch((error) => ({ hasError: true, error }));
    console.log({ response });
    if (response.hasError) {
      toast.error(
        "Ocurrio un error al cargar archivo(s), intente de nuevo mas tarde."
      );
      setLoading(false);

      return;
    }

    const body = {
      fileIds: response.ids,
      files,
    };

    setLoading(false);
    handleChangeFiles(body);
  };

  return (
    <Fragment>
      {loading && <LoaderSpinner />}
      <Menu>
        <MenuButton className="flex items-center hover:bg-gray-200">
          <div className="w-full flex items-center justify-between px-2 py-1 text-sm">
            Añadir un archivo
            {/* <ChevronRightIcon className="h-4 w-4 ml-1" /> */}
          </div>
        </MenuButton>
        <MenuItems
          anchor={{
            to: "right end",
            gap: "4px",
          }}
          className="rounded-md bg-white py-2 shadow-lg border focus:outline-none"
        >
          <label
            htmlFor="file-upload"
            className="block px-2 py-1 text-sm cursor-pointer leading-6 text-black hover:bg-gray-200"
          >
            <input
              type="file"
              accept=""
              onChange={handleFilesUpload}
              id="file-upload"
              className="sr-only outline-none focus:ring-0"
              multiple
              ref={inputFileRef}
            />
            <p>Subir Archivo</p>
          </label>
        </MenuItems>
      </Menu>
    </Fragment>
  );
}
