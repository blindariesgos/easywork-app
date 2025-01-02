import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { forwardRef, Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import AddDocumentDialog from "@/src/components/modals/AddDocument";
import { useSWRConfig } from "swr";

const AddDocuments = ({ leadId }) => {
  const { t } = useTranslation();
  const { mutate } = useSWRConfig();
  const [addFileProps, setAddFileProps] = useState({
    isOpen: false,
    cmrType: "lead",
    id: leadId,
  });

  const options = [
    { name: t("leads:add:quote"), type: "cotizacion", accept: null },
    { name: t("leads:add:rfc"), type: "documentos", accept: null },
    { name: t("leads:add:profile"), type: "perfil", accept: null },
    { name: t("leads:add:medica"), type: "medica", accept: null },
    { name: t("leads:add:solicitud"), type: "solicitud", accept: null },
    { name: t("leads:add:address"), type: "documentos", accept: null },
    { name: t("leads:add:policy"), type: "poliza", accept: ".pdf" },
  ];

  const handleAddDocument = (documentToAdd) => {
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
      <AddDocumentDialog
        {...addFileProps}
        setIsOpen={(open) => setAddFileProps({ ...addFileProps, isOpen: open })}
        update={() => {
          mutate(`/sales/crm/leads/${leadId}/activities`);
        }}
      />
      <Menu>
        <MenuButton className="py-2 px-4 bg-primary hover:bg-easy-500 text-white disabled:opacity-50 shadow-sm text-sm flex items-center gap-x-2 rounded-md  font-medium outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 justify-center">
          {t("leads:add:title")}
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
    </Fragment>
  );
};

export default AddDocuments;
