"use client";
import React, { useRef, useState } from "react";
import CardFile from "./CardFile";
import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { FaDropbox, FaGoogle } from "react-icons/fa6";
import { uploadTemporalFile } from "../../../../../../../lib/api/drive";
import { putTaskId } from "@/src/lib/apis";
import { toast } from "react-toastify";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useSWRConfig } from "swr";

export default function UploadDocuments({ files, deleteFiles, id }) {
  const { t } = useTranslation();
  const inputFileRef = useRef();
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const handleFilesUpload = async (event) => {
    setLoading(true);
    const fileList = Array.from(event.target.files);

    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file, file.name);
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
    };
    const update = await putTaskId(id, body).catch((error) => ({
      hasError: true,
      error,
    }));
    console.log({ update, body });

    if (update?.hasError) {
      toast.error(
        update?.error?.message ??
          "Ocurrio un error al guardar archivo(s), intente de nuevo mas tarde."
      );
      setLoading(false);
      return;
    }
    setLoading(false);
    toast.success("Archivo(s) guardado(s) con exito.");
    mutate(`/tools/tasks/${id}`);
  };
  return (
    <div className="pt-2">
      {loading && <LoaderSpinner />}
      <hr className="text-gray-200 border border-dashed" />
      <div className="text flex text-xs leading-6 text-gray-600 justify-start mt-4 gap-4 flex-wrap">
        <div className="">
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
        <div className="">
          <div className="flex flex-col items-center justify-center h-28 w-24 bg-white rounded-md shadow hover:drop-shadow-md">
            <Image
              width={200}
              height={200}
              className="h-8 w-auto"
              src="/img/Layer_1.png"
              alt="Your Company"
            />
            <p className="text-xs text-black mt-4">
              {t("tools:tasks:new:drive")}
            </p>
          </div>
        </div>
        <div className="">
          <div className="flex flex-col items-center justify-center h-28 w-24 bg-white rounded-md shadow hover:drop-shadow-md">
            <FaGoogle className="text-gray-200 w-8 h-8 " />
            <p className="text-xs text-black mt-4">
              {t("tools:tasks:new:google")}
            </p>
          </div>
        </div>
        <div className="">
          <div className="flex flex-col items-center justify-center h-28 w-24 bg-white rounded-md shadow hover:drop-shadow-md">
            <Image
              width={200}
              height={200}
              className="h-8 w-auto"
              src="/img/office365.svg"
              alt="Your Company"
            />
            <p className="text-xs text-black mt-4">
              {t("tools:tasks:new:office")}
            </p>
          </div>
        </div>
        <div className="">
          <div className="flex flex-col items-center justify-center h-28 w-24 bg-white rounded-md shadow hover:drop-shadow-md">
            <FaDropbox className="text-gray-200 w-8 h-8 " />
            <p className="text-xs text-black mt-4">
              {t("tools:tasks:new:dropbox")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}