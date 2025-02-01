import React, { useEffect, useRef, useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import TextInput from "./TextInput";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import clsx from "clsx";
import { useDebouncedCallback } from "use-debounce";
import { LoadingSpinnerSmall } from "../LoaderSpinner";
import { useRelatedUsers } from "@/src/lib/api/hooks/users";

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

const MultipleSelectAgentsAsync = ({
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
  const [filters, setFilters] = useState({});
  const { data: options, isLoading } = useRelatedUsers({
    page: 1,
    limit: 10,
    filters,
  });

  const handleSearch = useDebouncedCallback(() => {
    if (query.length > 0) {
      setFilters({
        search: query,
      });
    } else {
      setFilters({});
    }
  }, 500);

  useEffect(() => {
    handleSearch();
  }, [query]);

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
                  key={res.id}
                  className="bg-primary p-1 rounded-sm text-white flex gap-1 items-center text-xs"
                >
                  {res?.name ??
                    (res?.profile
                      ? `${res?.profile?.firstName} ${res?.profile?.lastName}`
                      : res.username)}
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
            {isLoading && (
              <div className="w-full h-[50px] flex justify-center items-center">
                <LoadingSpinnerSmall />
              </div>
            )}
            {options?.items?.length === 0 && query !== "" && !isLoading ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700 text-xs">
                {t("common:not-found")}
              </div>
            ) : (
              options?.items &&
              options?.items?.map((option) => (
                <MenuItem
                  as="div"
                  key={option.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 px-2 data-[disabled]:opacity-50 ${
                      active ? "bg-primary text-white" : "text-gray-900"
                    }`
                  }
                  onClick={() => handleSelect(option)}
                  disabled={option.disabled}
                >
                  <span
                    className={`block truncate pl-6 ${
                      getValues(name) &&
                      getValues(name).some((res) => res.id === option.id)
                        ? "font-medium"
                        : "font-normal"
                    }`}
                  >
                    {option.name}
                  </span>
                  {getValues(name) &&
                  getValues(name).some((res) => res.id === option.id) ? (
                    <span
                      className={`absolute inset-y-0 left-0 flex items-center pl-2 text-primary`}
                    >
                      <CheckIcon className="h-4 w-4" aria-hidden="true" />
                    </span>
                  ) : null}
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
export default MultipleSelectAgentsAsync;
