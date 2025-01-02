"use client";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { uploadTemporalFile } from "../../../../../../../lib/api/drive";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

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
      <div className="text flex text-xs leading-6 text-gray-600 justify-start mt-4 gap-4 flex-wrap">
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center justify-center h-28 w-24 bg-white rounded-md shadow hover:drop-shadow-md"
        >
          <ArrowUpTrayIcon className="text-blue-100 w-8 h-8 " />
          <input
            type="file"
            accept=""
            onChange={handleFilesUpload}
            id="file-upload"
            className="sr-only outline-none focus:ring-0"
            multiple
            ref={inputFileRef}
          />
          <p className="text-xs text-black mt-4">
            {t("tools:tasks:new:upload")}
          </p>
        </label>
      </div>
    </Fragment>
  );
}
