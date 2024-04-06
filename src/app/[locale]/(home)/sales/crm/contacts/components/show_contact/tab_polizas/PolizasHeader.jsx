'use client'
import { Dialog, DialogPanel } from "@tremor/react";
import React from "react";
import SelectRamo from "./SelectRamo";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { BsFileEarmarkPdf } from "react-icons/bs";
import clsx from "clsx";
import { subirPolizaPDF } from "@/lib/api";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";
import ComboboxComponent from "@/components/ComboboxComponent";
import useCrmContext from "@/context/crm";
import { useTranslation } from "react-i18next";

const initialState = {
  filePdf: "",
  aseguradora: "",
  tipo: "",
};

const company = [{ id: 1, name: "GNP" }];

const typePoliza = [
  { id: 1, name: "Auto" },
  { id: 2, name: "Gastos Médicos" },
  { id: 3, name: "Vida" },
];

export default function PolizasHeader({ contactID }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [sending, setSending] = React.useState(false);
  const [state, formAction] = useFormState(subirPolizaPDF, initialState);
  const { setLastContactUpdate } = useCrmContext();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    setSending(true);
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      const result = await subirPolizaPDF(state, formData);

      if (!result?.id) {
        if (result?.error) {
          return toast.error(result.message || t('contacts:edit:policies:exists'));
        }
        return toast.error(t('contacts:edit:policies:error-file'));
      }

      setLastContactUpdate(Date.now());
      toast.success(t('contacts:edit:policies:created'));
    } catch (error) {
      toast.error(t('contacts:edit:policies:error-file'));
    } finally {
      setIsOpen(false);
      setFile(null);
      setSending(false);
    }
  };

  return (
    <div className="bg-white w-full p-2 rounded-md flex gap-3">
      <button
        type="button"
        className="rounded-md bg-easy-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-easy-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-easy-600"
      >
        {t('contacts:edit:policies:general')}
      </button>
      <SelectRamo />
      <button
        type="button"
        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        {t('contacts:edit:policies:documents')}
      </button>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-x-1.5 rounded-md bg-easy-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-easy-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-easy-600"
      >
        <PlusCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />        
        {t('contacts:edit:policies:add')}
      </button>

      <Dialog
        open={isOpen}
        onClose={(val) => {
          setFile(null);
          setIsOpen(val);
        }}
        static={true}
      >
        <DialogPanel>
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-y-3"
          >
            <h1 className="text-center text-lg font-medium">              
              {t('contacts:edit:policies:upload')}
            </h1>
            <label
              type="button"
              htmlFor="filePdf"
              className="relative cursor-pointer block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <BsFileEarmarkPdf
                className={clsx(
                  file ? "text-easy-600" : "text-gray-400",
                  "mx-auto h-12 w-12"
                )}
                aria-hidden="true"
              />
              <span className="mt-2 block text-sm font-semibold text-gray-900">
                {file ? file.name : t('contacts:edit:policies:select')}
              </span>
            </label>
            <input
              id="filePdf"
              name="filePdf"
              type="file"
              aria-disabled={sending}
              accept="application/pdf"
              disabled={sending}
              className="sr-only"
              onChange={handleFileChange}
            />
            <input
              id="contactID"
              name="contactID"
              type="text"
              className="sr-only"
              value={contactID}
            />
            <div className="flex gap-2 w-full">
              <ComboboxComponent
                label={t('contacts:edit:policies:insurance')}
                elements={company}
                id="aseguradora"
                required={true}
              />
              <ComboboxComponent
                label={t('contacts:edit:policies:policy-type')}
                elements={typePoliza}
                id="tipo"
                required={true}
              />
            </div>
            <button
              type="submit"
              aria-disabled={sending || !file}
              disabled={sending || !file}
              className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-easy-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-easy-600"
            >
              {sending ? t('common:buttons:uploading') : t('common:buttons:upload')}
            </button>
          </form>
        </DialogPanel>
      </Dialog>
    </div>
  );
}
