import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDownIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import TextInput from "./TextInput";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import clsx from "clsx";

const getTextLabel = (tagLabel, onlyOne, itemsLength, t) => {
  if (tagLabel)
    return onlyOne
      ? itemsLength > 0
        ? t("common:buttons:change")
        : tagLabel
      : tagLabel;

  return onlyOne
    ? itemsLength > 0
      ? t("common:buttons:change")
      : t("common:buttons:add")
    : t("common:buttons:add");
};

const MultipleSelect = ({
  options,
  getValues,
  setValue,
  name,
  label,
  disabled,
  error,
  tagLabel,
  onlyOne,
  border,
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const handleSelect = (option) => {
    const array = getValues(name);
    if (onlyOne) return setValue(name, [option]);
    if (array) {
      const index = array.findIndex((res) => res.id === option.id);
      if (index === -1) {
        setValue(name, [...array, option], { shouldValidate: true });
      } else {
        const updatedResponsible = array.filter((res) => res.id !== option.id);
        setValue(name, updatedResponsible, { shouldValidate: true });
      }
    } else {
      setValue(name, [option], { shouldValidate: true });
    }
  };

  const handleRemove = (id) => {
    const updatedResponsible = getValues(name).filter((res) => res.id !== id);
    setValue(name, updatedResponsible, { shouldValidate: true });
  };

  const filterData =
    query === ""
      ? options
      : options.filter((opt) => {
          return `${opt.username} ${opt.name}`
            .toLowerCase()
            .includes(query.toLowerCase());
        });

  return (
    <div className="w-full">
      {label && (
        <label className="text-sm font-medium leading-6 text-gray-900  px-3">
          {label}
        </label>
      )}
      <Menu>
        <MenuButton
          disabled={disabled}
          className={clsx(
            "z-50 w-full outline-none min-h-[36px] bg-white focus:outline-none focus:ring-0 rounded-md  placeholder:text-xs text-sm ",
            {
              "border border-gray-200 focus:ring-gray-200 focus:outline-0":
                border,
              "border-none focus:ring-0 ": !border,
              // "bg-gray-100": disabled,
              "drop-shadow-md": !disabled,
            }
          )}
        >
          <span className="p-2 text-gray-60 flex gap-1 flex-wrap items-center">
            {getValues(name)?.length > 0 &&
              getValues(name).map((res) => (
                <div
                  key={res?.id}
                  className="bg-primary p-1 rounded-sm text-white flex gap-1 items-center text-xs"
                >
                  {res?.name ??
                    (res?.profile
                      ? `${res?.profile?.firstName} ${res?.profile?.lastName}`
                      : res?.username)}
                  <div
                    onClick={() => handleRemove(res.id)}
                    className="text-white cursor-pointer"
                  >
                    <XMarkIcon className="h-3 w-3 text-white" />
                  </div>
                </div>
              ))}
            {!disabled && (
              <div className="flex gap-1 border-b border-dashed ml-2 text-primary font-semibold">
                <PlusIcon className="h-3 w-3" />
                <p className="text-xs hover:text-primary/80">
                  {getTextLabel(tagLabel, onlyOne, getValues(name)?.length, t)}
                </p>
              </div>
            )}
          </span>
          <span className="absolute top-0 right-1 mt-2.5 flex items-center pr-2 pointer-events-none">
            <ChevronDownIcon className="h-4 w-4" />
          </span>
        </MenuButton>
        <MenuItems
          anchor="bottom start"
          className=" mt-1 w-[var(--button-width)] rounded-md bg-white shadow-lg z-50 py-2"
        >
          <div
            className="py-1 flex flex-col gap-2 px-2 max-h-60 overflow-y-auto"
            aria-labelledby="options-menu"
          >
            <div className="w-full">
              <TextInput
                placeholder="Buscar"
                onChangeCustom={(e) => setQuery(e.target.value)}
                border
              />
            </div>
            {filterData?.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700 text-xs">
                {t("common:not-found")}
              </div>
            ) : (
              filterData &&
              filterData.map((option) => (
                <MenuItem
                  as="div"
                  key={option.id}
                  className={`flex items-center px-4 py-2 text-sm cursor-pointer rounded-sm ${
                    getValues(name) &&
                    getValues(name).some((res) => res.id === option.id)
                      ? "bg-primary"
                      : "hover:bg-primary/10"
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option.avatar && (
                    <Image
                      src={option.avatar}
                      width={100}
                      height={100}
                      alt={`${option.name} avatar`}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                  )}
                  <span
                    className={`text-xs ${
                      getValues(name) &&
                      getValues(name).some((res) => res.id === option.id)
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {option.name || option.username}
                  </span>
                </MenuItem>
              ))
            )}
          </div>
        </MenuItems>
      </Menu>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
};
export default MultipleSelect;
