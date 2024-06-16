import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDownIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import TextInput from "@/src/components/form/TextInput";

const DropdownSelect = ({
  options,
  getValues,
  setValue,
  name,
  label,
  error,
  onlyOne,
  isOpen,
  setIsOpen
}) => {
  const { t } = useTranslation();
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
      <div className="relative mt-1">
        {isOpen && (
          <div ref={dropdownRef} className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-50 py-2">
            <div
              className="py-1 flex flex-col gap-2 px-2"
              aria-labelledby="options-menu"
            >
              <div className="w-full mt-2">
                <TextInput
                  placeholder={t("tools:tasks:search")}
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
                    className={`flex items-center px-4 py-2 text-sm cursor-pointer rounded-md ${
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
export default DropdownSelect;
