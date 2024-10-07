import Button from "@/src/components/form/Button";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { forwardRef, Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

const AddDocuments = () => {
  const { t } = useTranslation();

  const options = [
    { name: t("leads:add:rfc"), disabled: true },
    { name: "Comprobante de domicilio o recibo de servicio", disabled: true },
    { name: "Constancia de situación fiscal", disabled: true },
  ];

  return (
    <Fragment>
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
              onClick={option.onclick && option.onclick}
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
