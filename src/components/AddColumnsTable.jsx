"use client";
import React, { Fragment, useEffect, useState } from "react";
import { Menu, MenuButton, MenuItems, Transition } from "@headlessui/react";
import { Cog8ToothIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";

const AddColumnsTable = ({ setSelectedColumns, columns: data }) => {
  const { t } = useTranslation();
  const [columns, setColmuns] = useState(data);

  useEffect(() => {
    setSelectedColumns(columns.filter((c) => c.check));
  }, [columns, setSelectedColumns]);

  const handleSelectChange = (col) => {
    const updateChecked = columns.map((column) => {
      return column.id == col.id && !column.permanent
        ? { ...column, check: !col.check }
        : column;
    });
    setSelectedColumns(updateChecked.filter((c) => c.check));
    setColmuns(updateChecked);
  };

  return (
    <Menu as="div" className="relative">
      <MenuButton className="text-gray-60 bg-transparent text-xs font-semibold focus:ring-0 flex items-center">
        <Cog8ToothIcon className="h-5 w-5 text-primary " aria-hidden="true" />
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems
          anchor="bottom start"
          className={`mt-2 rounded-md bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 w-96 p-2`}
        >
          <div className="grid grid-cols-2 gap-4">
            {columns.map((col, index) => (
              <div
                key={index}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded-md"
                onClick={() => handleSelectChange(col)}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  value={col.id}
                  checked={col.check}
                />
                <p className="text-sm font-normal">{col.name}</p>
              </div>
            ))}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default AddColumnsTable;
