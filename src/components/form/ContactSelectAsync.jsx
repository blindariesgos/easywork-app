// SelectInput.js
"use client";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useContacts } from "@/src/lib/api/hooks/contacts";
import { LoadingSpinnerSmall } from "../LoaderSpinner";
import { getContactId } from "@/src/lib/apis";
import { useDebouncedCallback } from "use-debounce";
import { RxCrossCircled } from "react-icons/rx";

function ContactSelectAsync({
  label,
  selectedOption,
  disabled,
  name,
  error,
  setValue,
  border,
  watch,
  setSelectedOption,
  placeholder,
  helperText,
  notFoundHelperText,
  isRequired,
}) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});
  const { contacts: options, isLoading } = useContacts({
    page: 1,
    limit: 10,
    filters,
  });
  const handleSearch = useDebouncedCallback(() => {
    if (query.length > 0) {
      setFilters({
        name: query,
      });
    } else {
      setFilters({});
    }
  }, 500);

  const handleClear = () => {
    setSelected("");
    setQuery("");
    setValue(name, null);
  };

  useEffect(() => {
    handleSearch();
  }, [query]);

  useEffect(() => {
    if (selectedOption) {
      setSelected(selectedOption);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (selected) {
      setValue && setValue(name, selected);
      setSelectedOption && setSelectedOption(selected);
    }
  }, [selected, setValue, name, setSelectedOption]);

  useEffect(() => {
    if (!watch || !watch(name) || selected) return;
    const getContact = async (contactId) => {
      const response = await getContactId(contactId);
      if (response.hasError) return;
      setSelected(response);
    };
    getContact(watch(name));
  }, [watch && watch(name)]);

  const handleNotFound = () =>
    notFoundHelperText ? (
      notFoundHelperText()
    ) : (
      <div className="relative cursor-default select-none px-4 py-2 text-gray-700 text-xs">
        {t("common:not-found")}
      </div>
    );

  return (
    <div className="w-full">
      <Combobox
        as="div"
        value={selected}
        onChange={setSelected}
        disabled={disabled}
        className="group"
      >
        {label && (
          <label
            className={`block text-sm font-medium leading-6 text-gray-900 px-3 relative`}
          >
            {label}
            {isRequired && (
              <span className="text-sm text-red-600 absolute top-0 left-0">
                *
              </span>
            )}
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
                // "bg-gray-100": disabled,
                "drop-shadow-md": !disabled,
              }
            )}
            displayValue={(person) => person?.fullName}
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
                <ChevronDownIcon
                  className="h-5 w-5 text-primary"
                  aria-hidden="true"
                />
              </ComboboxButton>
            </Fragment>
          )}

          <ComboboxOptions
            transition
            anchor={{
              to: "bottom end",
              gap: 5,
            }}
            className="z-50 w-[var(--input-width)] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            {isLoading && (
              <div className="w-full h-[50px] flex justify-center items-center">
                <LoadingSpinnerSmall />
              </div>
            )}
            {options?.items?.length === 0 && query !== "" && !isLoading
              ? handleNotFound()
              : options?.items &&
                options?.items?.map((option) => (
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
                          {option.fullName}
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
                ))}
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

export default ContactSelectAsync;
