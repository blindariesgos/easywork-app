"use client";
import React, { Fragment } from "react";
import {
  Menu,
  Transition,
  MenuItem,
  MenuItems,
  MenuButton,
} from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import NewFields from "./NewFields";

const AddFields = ({ append, remove, fields }) => {
  const { t } = useTranslation();

  return (
    <Menu as="div" className="relative inline-block">
      <MenuButton className="inline-flex text-gray-60 bg-transparent text-xs font-semibold gap-2 mt-1.5">
        <PlusIcon className="h-4 w-4" />
        {t("contacts:filters:add-field")}
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom start"
        className={`absolute left-0 mt-2 rounded-md bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 w-60`}
      >
        <NewFields append={append} remove={remove} fields={fields} />
      </MenuItems>
    </Menu>
  );
};

export default AddFields;
