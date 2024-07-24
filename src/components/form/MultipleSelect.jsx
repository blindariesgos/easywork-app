import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  ChevronDownIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import TextInput from "./TextInput";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from "@headlessui/react";

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
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([])

  const handleSelect = (options) => {
    if (onlyOne) return setValue(name, [options[0]]);
    setValue(name, options, { shouldValidate: true });
    setSelected(options)
  };

  const handleRemove = (id) => {
    const updated = selected.filter((res) => res.id !== id);
    setValue(name, updated, { shouldValidate: true });
    setSelected(updated)
  };

  const filteredData =
    query === ''
      ? options
      : options.filter((option) => {
        return `${option.username} ${option.name}`
          .toLowerCase()
          .includes(query.toLowerCase());
      })

  return (
    <div>

      <Combobox
        multiple
        value={selected}
        onChange={handleSelect}
        onClose={() => setQuery('')}
        disabled={disabled}>
        {
          label && (
            <Label className="text-sm font-medium leading-6 text-gray-900">
              {label}
            </Label>

          )
        }
        <div className="relative">
          <ComboboxButton
            className="text-left w-full outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none border-none rounded-md drop-shadow-sm placeholder:text-xs focus:ring-0 text-sm bg-white py-2"
          >
            <span className="ml-2 text-gray-60 flex gap-1 flex-wrap items-center">
              {selected?.length > 0 &&
                selected.map((res) => (
                  <div
                    key={res.id}
                    className="bg-primary p-1 rounded-sm text-white flex gap-1 items-center text-xs"
                  >
                    {res.name || res.username}
                    <div
                      onClick={() => handleRemove(res.id)}
                      className="text-white cursor-pointer"
                    >
                      <XMarkIcon className="h-3 w-3 text-white" />
                    </div>
                  </div>
                ))}
              <div className="flex gap-1 border-b border-dashed ml-2 text-primary font-semibold">
                <PlusIcon className="h-3 w-3" />
                <p className="text-xs hover:text-primary/80">{getTextLabel(tagLabel, onlyOne, selected?.length, t)}</p>
              </div>
            </span>
            <span className="absolute top-0 right-1 mt-2.5 flex items-center pr-2 pointer-events-none">
              <ChevronDownIcon className="h-4 w-4" />
            </span>
          </ComboboxButton>
          <ComboboxOptions
            transition
            anchor="bottom start"
            className="border mt-1 w-full rounded-md bg-white shadow-lg z-50 p-2"
          >
            {/* <TextInput
              onChangeCustom={(e) => setQuery(e.target.value)}
              border
              className="mb-2"
            /> */}
            {filteredData.map((option) => (
              <ComboboxOption key={option.id} value={option} className={`flex items-center group hover:bg-primary/10 data-[selected]:bg-primary  px-4 py-2 text-sm cursor-pointer rounded-sm`}>
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
                  className={`text-xs group-data-[selected]:text-white text-black hover:text-white`}
                >
                  {option.name || option.username}
                </span>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </div>
      </Combobox>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
};
export default MultipleSelect;
