import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  ComboboxButton,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
} from "@headlessui/react";
import {
  ChevronDownIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import TextInput from "./TextInput";

const ComboBoxMultiSelect = ({
  options,
  getValues,
  setValue,
  name,
  label,
  disabled,
  error,
  onlyOne,
  showAvatar,
}) => {
  const { t } = useTranslation();

  const [query, setQuery] = useState("");

  const handleClick = () => {
    setQuery("");
  };

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
    <Fragment>
      <Menu>
        <label className="text-sm font-medium leading-6 text-gray-900">
          {label}
        </label>
        <div className="relative">
          <div className="text-left w-full outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none border-none rounded-md placeholder:text-xs focus:ring-0 text-sm bg-white py-2">
            <div className=" text-gray-60 flex gap-1 flex-wrap items-center">
              {getValues(name)?.length > 0 &&
                getValues(name).map((selected) => (
                  <div
                    key={selected.id}
                    className="flex-shrink-0 max-w-48 hover:opacity-75 inline-flex gap-x-0.5 items-center bg-indigo-100 py-1 px-2 rounded-sm font-medium text-indigo-800"
                  >
                    {showAvatar && (
                      <Image
                        width={32}
                        height={32}
                        className="inline-block h-5 w-5 rounded-full"
                        src={selected.avatar || "/img/avatar.svg"}
                        alt={"avatar"}
                      />
                    )}
                    <p className="text-xs text-zinc-700 ml-1 truncate">
                      {selected.name}
                    </p>
                    <button
                      type="button"
                      className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-primary/20"
                      onClick={() => handleRemove(selected.id)}
                    >
                      <span className="sr-only">
                        {t("tools:calendar:new-event:remove")}
                      </span>
                      <svg
                        viewBox="0 0 14 14"
                        className="h-3.5 w-3.5 stroke-indigo-700/50 group-hover:stroke-indigo-700/75"
                      >
                        <path d="M4 4l6 6m0-6l-6 6" />
                      </svg>
                      <span className="absolute -inset-1" />
                    </button>
                  </div>
                ))}
              <MenuButton
                onClick={handleClick}
                className="relative inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-500 focus:outline-none"
              >
                <span className="absolute -inset-2" />
                <span className="sr-only">
                  {t("tools:calendar:new-event:add-team")}
                </span>
                <PlusIcon className="h-5 w-5" aria-hidden="true" />
              </MenuButton>
            </div>
          </div>
          <MenuItems
            transition
            anchor="bottom"
            className="rounded-md bg-white shadow-lg z-50 py-2 w-[300px]"
          >
            <div
              className="py-1 flex flex-col gap-2 px-2"
              aria-labelledby="options-menu"
            >
              <div className="w-full">
                <TextInput
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
                    key={option.id}
                    className={`flex items-center px-4 py-2 text-sm cursor-pointer rounded-sm ${
                      getValues(name) &&
                      getValues(name).some((res) => res.id === option.id)
                        ? "bg-primary"
                        : "hover:bg-primary/10"
                    }`}
                    onClick={() => handleSelect(option)}
                    as={"div"}
                  >
                    {showAvatar && (
                      <Image
                        src={option.avatar || "/img/avatar.svg"}
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
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
      </Menu>
    </Fragment>
  );
};
export default ComboBoxMultiSelect;
