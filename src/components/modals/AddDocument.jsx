import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useCallback, useState } from "react";
import Button from "../form/Button";
import { useTranslation } from "react-i18next";
import { MdUpload } from "react-icons/md";
import { addReceiptDocument } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { addLeadDocument } from "../../lib/apis";
import { handleApiError } from "@/src/utils/api/errors";

const AddDocumentDialog = ({
  cmrType,
  id,
  documentType,
  isOpen,
  setIsOpen,
  title,
  update,
  accept,
  onFinished,
}) => {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleChangeFile = useCallback((event) => {
    const currentFile = event.target.files[0];

    if (currentFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = {
          file: currentFile,
          size: currentFile.size,
          name: currentFile.name,
        };

        setFile(result);
      };
      reader.readAsDataURL(currentFile);
    }
  }, []);

  const endpoints = {
    receipt: (data) => addReceiptDocument(id, documentType, data),
    lead: (data) => addLeadDocument(id, documentType, data),
  };

  const handleFormSubmit = async () => {
    const formData = new FormData();
    formData.append("files", file.file);

    try {
      setLoading(true);
      const response = await endpoints[cmrType](formData);
      if (response.hasError) {
        let message = response.message;
        if (response.errors) {
          message = response.errors.join(", ");
        }
        throw { message };
      }
      toast.success("Documento agregado con exito");
      onFinished && onFinished();
      update && update();
    } catch (error) {
      handleApiError(error.message);
    } finally {
      setLoading(false);
      setIsOpen(false);
      setFile(null);
    }
  };
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-[99999]"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <DialogPanel className="max-w-lg space-y-4 bg-white px-12 py-6 rounded-xl">
          <DialogTitle className="">{title}</DialogTitle>
          <Description>
            <div className="text-center">
              <label
                htmlFor="uploadDocument"
                type="button"
                className="cursor-pointer text-sm text-black"
              >
                <div className="col-span-full flex justify-center items-center flex-col gap-x-4 py-8 bg-white rounded-lg p-3">
                  <input
                    id="uploadDocument"
                    name="uploadDocument"
                    type="file"
                    className="peer hidden inset-0 h-full w-full  rounded-md opacity-0"
                    onChange={handleChangeFile}
                    accept={
                      accept ??
                      ".pdf, .doc, .txt, .key, .csv, .docx, .xls, .xlsx, .ppt, .pptx, .jpg, .jpeg, .png, .gif, .svg"
                    }
                  />
                  <div className="flex gap-1">
                    <MdUpload className="w-6 h-6 text-pimary" />
                    <p className="">{"Seleccionar Documento"}</p>
                  </div>
                  {file && <p className="text-gray-50">{file.name}</p>}
                </div>
                {/* <p className="mt-1 text-xs leading-5 text-black">
                  {label || t("contacts:create:jpg")}
                </p> */}
              </label>
            </div>
          </Description>
          <div className="flex gap-4 justify-center">
            <Button
              buttonStyle="secondary"
              onclick={() => setIsOpen(false)}
              label={t("common:buttons:cancel")}
              className="px-2 py-1"
            />
            <Button
              buttonStyle="primary"
              onclick={handleFormSubmit}
              disabled={!file}
              label={t("common:buttons:add")}
              className="px-2 py-1"
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AddDocumentDialog;
