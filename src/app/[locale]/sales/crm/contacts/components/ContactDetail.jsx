"use client";
import React, { useState } from "react";
import AddContactTabs from "./create_contact/AddContactTabs";
import useCrmContext from "@/context/crm";
import { updateContact } from "@/lib/api";
import useAppContext from "@/context/app";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const compareValues = (fieldValue, originalValue) => {
  if (fieldValue === "" || fieldValue === null) {
    return "remove";
  } else if (fieldValue === originalValue) {
    return "unchanged";
  } else {
    return "changed";
  }
};

export default function ContactDetail({ children }) {
  const { t } = useTranslation();
  const { setShowContact } = useAppContext();
  const {
    currentContact,
    contactEditMode,
    setContactEditMode,
    setLastContactsUpdate,
  } = useCrmContext();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!currentContact) {
    return <div>{t("contacts:edit:not-contact")}</div>;
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const formData = new FormData(e.target);

    const filteredFormData = new FormData();
    for (const [field, value] of formData.entries()){
      const comparisonResult = compareValues(value, currentContact[field]);
      if (comparisonResult === "remove") {
        filteredFormData.append(field, ""); // Enviar campo vacío para eliminar
        filteredFormData.append(`${field}_remove`, true); // Enviar campo vacío para eliminar
      } else if (comparisonResult === "changed") {
        filteredFormData.append(field, value);
        filteredFormData.append(`${field}_changed`, true);
      } else {
        filteredFormData.append(`${field}_original`, true);
      }
    }
    try {
      const result = await updateContact(currentContact, filteredFormData);

      if (!result?.success) {
        if (result?.errors) {
          console.log(result.errors);
          setErrors(result.errors);
        }
        return;
      }

      setLastContactsUpdate(Date.now());
      toast.success(t("contacts:edit:updated-contact"));
      setShowContact(false);
    } catch (error) {
      toast.error(t("contacts:edit:error"));
    } finally {
      setLoading(false);
    }
    console.log("Formulario enviado");
  };

  return (
    <div className="flex flex-col h-screen">
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col flex-1 bg-zinc-200 opacity-100 shadow-xl text-zinc-800 overflow-hidden rounded-tl-3xl"
      >
        {/* Encabezado del Formulario */}
        <div className="bg-transparent py-6 mx-4">
          <div className="flex items-start flex-col justify-between space-y-3">
            <h1 className="text-2xl">
              {currentContact.nombre} {currentContact.apellidos}
            </h1>
            <AddContactTabs />
            {/* <AddContactTabs /> */}
          </div>
        </div>

        {/* Cuerpo del Formulario */}
        {children}
        {/* Botones de acción */}
        {contactEditMode && (
          <div className="flex justify-start px-4 py-4 sticky bottom-0 bg-zinc-200">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {t("common:buttons:save")}
            </button>
            <button
              type="button"
              onClick={()=>{
                setContactEditMode(false);
                setShowContact(false);
              }}
              className="ml-4 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
            >
              {t("common:buttons:cancel")}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
