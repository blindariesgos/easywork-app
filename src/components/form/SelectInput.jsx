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

function SelectInput({
  label,
  selectedOption,
  options,
  disabled,
  register,
  name,
  error,
  setValue,
  object,
  border,
  value,
  watch,
  setSelectedOption,
  placeholder,
}) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(object ? {} : "");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (selectedOption) {
      setSelected(selectedOption);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (selected) {
      setValue && setValue(name, object ? selected : selected.id);
      setSelectedOption && setSelectedOption(selected);
    }
  }, [selected, setValue, name, object, setSelectedOption]);

  const filteredElements =
    query === ""
      ? options
      : options.filter((element) => {
          return element.name.toLowerCase().includes(query.toLowerCase());
        });

  useEffect(() => {
    if (!watch || !options) return;
    if (object && Object.keys(selected).length > 0) return;
    if (!object && selected?.length > 0) return;

    const option = options.find((option) => option.id == watch(name));
    setSelected(option);
  }, [watch && watch(name), options]);

  return (
    <div className="w-full">
      <Combobox
        as="div"
        value={selected}
        onChange={setSelected}
        disabled={disabled}
      >
        {label && (
          <label
            className={`block text-sm font-medium leading-6 text-gray-900`}
          >
            {label}
          </label>
        )}

        <div className={`relative ${label ? "mt-1" : "mt-0"}`}>
          <ComboboxInput
            placeholder={placeholder}
            className={clsx(
              "z-50 w-full outline-none focus:outline-none focus:ring-0 rounded-md  placeholder:text-xs text-sm ",
              {
                "border border-gray-200 focus:ring-gray-200 focus:outline-0":
                  border,
                "border-none focus:ring-0 ": !border,
                "bg-gray-100": disabled,
                "drop-shadow-sm": !disabled,
              }
            )}
            displayValue={(person) => person?.name}
            onChange={(event) => {
              setQuery && setQuery(event.target.value);
            }}
          />
          {!disabled && (
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon
                className="h-5 w-5 text-primary"
                aria-hidden="true"
              />
            </ComboboxButton>
          )}

          <ComboboxOptions
            transition
            anchor="bottom end"
            className="z-50 w-[var(--input-width)] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            {filteredElements?.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700 text-xs">
                {t("common:not-found")}
              </div>
            ) : (
              filteredElements &&
              filteredElements.map((person) => (
                <ComboboxOption
                  key={person.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 px-2 ${
                      active ? "bg-primary text-white" : "text-gray-900"
                    }`
                  }
                  value={person}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate pl-6 ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {person.name}
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
      </Combobox>
    </div>
  );
}

export default SelectInput;
