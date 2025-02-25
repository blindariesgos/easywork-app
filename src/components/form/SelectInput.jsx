// SelectInput.js
"use client";
import {
  Combobox,
  Transition,
  ComboboxInput,
  ComboboxButton,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RxCrossCircled } from "react-icons/rx";

function SelectInput({
  label,
  selectedOption,
  options,
  disabled,
  name,
  error,
  setValue,
  object,
  border,
  watch,
  setSelectedOption,
  placeholder,
  helperText,
  small,
  isRequired,
  className,
}) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState();
  const [query, setQuery] = useState("");

  const handleClear = () => {
    setSelected("");
    setQuery("");
  };

  useEffect(() => {
    if (selectedOption) {
      setSelected(selectedOption);
    }
  }, [selectedOption]);

  const filteredElements =
    query === ""
      ? options
      : options.filter((element) => {
          return element.name.toLowerCase().includes(query.toLowerCase());
        });

  useEffect(() => {
    if (!watch || !options || !watch(name)) return;
    if (watch(name) == "") {
      setSelected();
      return;
    }
    const option = options.find((option) => option.id == watch(name));
    setSelected(option);
  }, [watch && watch(name), options]);

  const handleChange = (value) => {
    setSelected(value);
    if (value) {
      setValue && setValue(name, object ? value : value.id);
      setSelectedOption && setSelectedOption(value);
    } else {
      setValue && setValue(name, object ? {} : "");
      setSelectedOption && setSelectedOption({});
    }
  };

  return (
    <div className={clsx("w-full ", className)}>
      <Combobox
        as="div"
        value={selected}
        onChange={handleChange}
        disabled={disabled}
        className="group"
      >
        {label && (
          <label
            className={clsx(
              "block font-medium leading-6 text-gray-900 px-3 relative ",
              {
                "text-xs": small,
                "text-sm": !small,
              }
            )}
          >
            {label}
            {isRequired && (
              <span className="text-sm text-red-600 absolute top-0 left-0">
                *
              </span>
            )}
          </label>
        )}

        <div className={` group relative ${label ? "mt-1" : "mt-0"}`}>
          <ComboboxInput
            placeholder={placeholder}
            className={clsx(
              "z-50 w-full outline-none focus:outline-none focus:ring-0 rounded-md  placeholder:text-xs",
              {
                "border border-gray-200 focus:ring-gray-200 focus:outline-0":
                  border,
                "border-none focus:ring-0 ": !border,
                // "bg-gray-100": disabled,
                "drop-shadow-md": !disabled,
                "text-xs": small,
                "text-sm": !small,
                "py-1.5": small,
              }
            )}
            displayValue={(person) => person?.name}
            onChange={(event) => {
              setQuery && setQuery(event.target.value);
            }}
          />
          {!disabled && (
            <Fragment>
              {selected && (
                <div
                  className={clsx(
                    "absolute inset-y-0 right-5 group-hover:flex items-center pr-2 cursor-pointer hidden "
                  )}
                  onClick={handleClear}
                >
                  <RxCrossCircled className="w-4 h-4 text-primary" />
                </div>
              )}
              <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon className="h-5 w-5 text-primary" />
              </ComboboxButton>
            </Fragment>
          )}

          <ComboboxOptions
            transition
            anchor={{
              to: "bottom end",
              gap: "5px",
            }}
            className="z-50 w-[var(--input-width)] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            {filteredElements?.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700 text-xs">
                {t("common:not-found")}
              </div>
            ) : (
              filteredElements &&
              filteredElements.map((option) => (
                <ComboboxOption
                  key={option.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 px-2 data-[disabled]:opacity-50 ${
                      active ? "bg-primary text-white" : "text-gray-900"
                    }`
                  }
                  value={option}
                  disabled={option.disabled}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate pl-6 ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option.name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-2 ${
                            active ? "text-white" : "text-primary"
                          }`}
                        >
                          <CheckIcon className="h-4 w-4" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
        {helperText && (
          <p className="mt-1 text-xs text-gray-50 italic">{helperText}</p>
        )}
      </Combobox>
    </div>
  );
}

export default SelectInput;
