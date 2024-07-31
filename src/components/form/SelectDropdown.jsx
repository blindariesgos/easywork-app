// SelectDropdown.js
"use client";
import { Combobox, Transition, ComboboxButton, ComboboxOptions, ComboboxOption, ComboboxInput, Label } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import Image from "next/image";
import React, { Fragment, useEffect, useState } from "react";

function SelectDropdown({
  label,
  selectedOption,
  options,
  disabled,
  register,
  name,
  error,
  setValue,
  className,
  border
}) {
  const registerInput = register && register(name);
  const [selected, setSelected] = useState(selectedOption);
  const [query, setQuery] = useState("");


  useEffect(() => {
    if (selectedOption) {
      setSelected(selectedOption)
    }
  }, [selectedOption])

  useEffect(() => {
    if (selected) setValue && setValue(name, selected?.id);
  }, [selected, setValue, name])

  const filteredElements =
    query === ""
      ? options
      : options.filter((element) => {
        return `${element.name} ${element.username}`.toLowerCase().includes(query.toLowerCase());
      });

  return (
    <div className={className}>
      <Combobox as="div" value={selected} onChange={setSelected} disabled={disabled} className="relative">
        <Label className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </Label>
        <div className="relative mt-1">
          <ComboboxInput
            className={clsx(
              "z-50 w-full outline-none focus:outline-none focus:ring-0 rounded-md  placeholder:text-xs text-sm ", {
              "border border-gray-200 focus:ring-gray-200 focus:outline-0": border,
              "border-none focus:ring-0 ": !border,
              "bg-gray-100": disabled,
              "drop-shadow-sm": !disabled
            }
            )}
            displayValue={(person) => person?.name || person?.username}
            onChange={(event) => {
              // registerInput && registerInput.onChange(event);
              setQuery(event.target.value);
            }
            }
          />
          {
            !disabled && (
              <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </ComboboxButton>

            )
          }
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <ComboboxOptions anchor="bottom end" className="z-50 max-h-[400px] mt-1 w-[var(--input-width)] rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {filteredElements?.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredElements && filteredElements.map((option) => (
                  <ComboboxOption
                    key={option.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-6 pr-4 ${active ? 'bg-primary text-white rounded-md' : 'text-gray-900'
                      }`
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`flex items-center gap-2 w-full${selected ? 'font-medium' : 'font-normal'
                            }`}
                        >
                          <div className="w-[20%]">
                            <Image
                              src={option.avatar || "/img/avatar.svg"}
                              alt=""
                              height={500}
                              width={500}
                              layout="fixed"
                              objectFit="cover"
                              className="h-6 w-6 rounded-full"
                            />
                          </div>
                          <div className={`flex flex-col leading-3 w-[80%]`}>
                            <p className={`text-[10px] font-medium ${active ? "text-white" : "text-black"}`}>{option.name || option?.username}</p>
                            <p className={`text-[10px] text-gray-50 ${active ? "text-white" : "text-black"} flex-wrap`}>{option.email}</p>
                            <p className={`text-[10px] text-gray-50 ${active ? "text-white" : "text-black"}`}>{option.phone}</p>
                          </div>
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-1 ${active ? 'text-white' : 'text-primary'
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
          </Transition>
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
      </Combobox>
    </div>
  );
}

export default SelectDropdown;
