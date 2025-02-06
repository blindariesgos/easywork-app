"use client";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Button from "@/src/components/form/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import AddDocumentDialog from "@/src/components/modals/AddDocument";
import { useSWRConfig } from "swr";

export default function AddDocumentButton({ id }) {
  const { t } = useTranslation();
  const { mutate } = useSWRConfig();
  const [addFileProps, setAddFileProps] = useState({
    isOpen: false,
    cmrType: "reimbursement",
    id,
  });

  const options = [
    {
      name: "Formato Reembolso de Accidente y/o Enfermedad",
      type: "pago",
    },
    {
      name: "Recetas Médicas",
      type: "factura",
    },
    {
      name: "Informe Médico",
      type: "factura",
    },
    {
      name: "Facturas",
      type: "pago",
    },
    {
      name: "Estudios de Laboratorio",
      type: "pago",
    },
    {
      name: "Documento Aclaración - Subsecuente",
      type: "pago",
    },
    {
      name: "Carta de Finiquito",
      type: "pago",
    },
  ];

  const handleAddDocument = (documentToAdd) => {
    if (documentToAdd?.customOpen) {
      documentToAdd?.customOpen();
      return;
    }
    setAddFileProps({
      ...addFileProps,
      isOpen: true,
      documentType: documentToAdd?.type,
      title: t("common:add-document", { document: documentToAdd?.name }),
      accept: documentToAdd?.accept,
    });
  };

  return (
    <Fragment>
      <Menu>
        <MenuButton>
          <Button
            label={t("common:buttons:add-2")}
            buttonStyle="primary"
            icon={<PlusIcon className="h-4 w-4 text-white" />}
            className="py-2 px-3"
          />
        </MenuButton>
        <MenuItems
          transition
          anchor="bottom start"
          className="rounded-md mt-2 bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 grid grid-cols-1 gap-2 p-2 "
        >
          {options.map((option, index) => (
            <MenuItem
              key={index}
              as="div"
              onClick={() => handleAddDocument(option)}
              disabled={option.disabled}
              className="px-2 py-1 hover:[&:not(data-[disabled])]:bg-gray-100 rounded-md text-sm cursor-pointer data-[disabled]:cursor-auto data-[disabled]:text-gray-50"
            >
              {option.name}
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
      <AddDocumentDialog
        {...addFileProps}
        setIsOpen={(open) => setAddFileProps({ ...addFileProps, isOpen: open })}
        update={() => {
          mutate(`/operations/reimbursements/${id}/activities`);
        }}
      />
    </Fragment>
  );
}
