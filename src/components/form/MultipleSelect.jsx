import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDownIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import TextInput from "./TextInput";

const getTextLabel = (tagLabel, onlyOne, itemsLength, t) => {
  if (tagLabel) return onlyOne ? itemsLength > 0 ? t("common:buttons:change") : tagLabel : tagLabel;

  return onlyOne ? itemsLength > 0 ? t("common:buttons:change") : t("common:buttons:add") : t("common:buttons:add")
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
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  // const [options, setOptions] = useState(data);
  const [query, setQuery] = useState("");

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleToggle = () => {
    setQuery("");
    setIsOpen(!isOpen);
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

    setIsOpen(false); // Close the dropdown after selection
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
    <div>
      <label className="text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className="text-left w-full outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none border-none rounded-md drop-shadow-sm placeholder:text-xs focus:ring-0 text-sm bg-white py-2"
        >
          <span className="ml-2 text-gray-60 flex gap-1 flex-wrap items-center">
            {getValues(name)?.length > 0 &&
              getValues(name).map((res) => (
                <div
                  key={res.id}
                  className="bg-primary p-1 rounded-sm text-white flex gap-1 items-center text-xs"
                >
                  {res.name || res.username}
                  <button
                    type="button"
                    onClick={() => handleRemove(res.id)}
                    className="text-white"
                  >
                    <XMarkIcon className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
            <div className="flex gap-1 border-b border-dashed ml-2 text-primary font-semibold">
              <PlusIcon className="h-3 w-3" />
              <p className="text-xs hover:text-primary/80">{getTextLabel(tagLabel, onlyOne, getValues(name)?.length, t)}</p>
            </div>
          </span>
          <span className="absolute top-0 right-1 mt-2.5 flex items-center pr-2 pointer-events-none">
            <ChevronDownIcon className="h-4 w-4" />
          </span>
        </button>
        {isOpen && (
          <div ref={dropdownRef} className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-50 py-2">
            <div
              className="py-1 flex flex-col gap-2 px-2"
              aria-labelledby="options-menu"
            >
              <div className="w-full mt-2">
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
                  <div
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
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
};
export default MultipleSelect;
