import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { forwardRef, Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

const AddDocuments = () => {
  const { t } = useTranslation();

  const options = [
    { name: t("leads:add:quote"), disabled: true },
    { name: t("leads:add:rfc"), disabled: true },
    { name: t("leads:add:profile"), disabled: true },
    { name: t("leads:add:policy"), disabled: true },
  ];

  return (
    <Fragment>
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
