import Button from "@/src/components/form/Button";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { forwardRef, Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import AddDocumentDialog from "@/src/components/modals/AddDocument";
import { useSWRConfig } from "swr";
import AddVersion from "./AddVersion";

const AddDocuments = ({ contactId }) => {
  const { t } = useTranslation();
  const { mutate } = useSWRConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [addFileProps, setAddFileProps] = useState({
    isOpen: false,
    cmrType: "contact",
    id: contactId,
  });
  const options = [
    { name: t("leads:add:rfc"), type: "documentos", accept: null },
    {
      name: "Comprobante de domicilio o recibo de servicio",
      type: "documentos",
      accept: null,
    },
    {
      name: "Constancia de situación fiscal",
      type: "documentos",
      accept: null,
    },
    {
      name: "Endoso o versión de póliza",
      type: "poliza",
      accept: null,
      customOpen: () => setIsOpen(true),
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
      <AddDocumentDialog
        {...addFileProps}
        setIsOpen={(open) => setAddFileProps({ ...addFileProps, isOpen: open })}
        update={() => {
          mutate(`/sales/crm/contacts/${contactId}/activities`);
        }}
      />
      <AddVersion isOpen={isOpen} setIsOpen={setIsOpen} contactId={contactId} />
      <Menu>
        <MenuButton>
          <Button
            label={t("leads:add:title")}
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
    </Fragment>
  );
};

export default AddDocuments;
