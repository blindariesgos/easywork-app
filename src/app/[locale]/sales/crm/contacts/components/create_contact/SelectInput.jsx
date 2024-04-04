// SelectInput.js
"use client";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { TextInput } from "@tremor/react";
import clsx from "clsx";
import React, { useEffect } from "react";

function SelectInput({
  id,
  label,
  selectedOption,
  setSelectedOption,
  options,
  onChangeInput,
  disabled = false,
  className,
}) {

  const [selected, setSelected] = React.useState(selectedOption);
  

  useEffect(()=>{
    if (selectedOption) {
      setSelected(selectedOption)
    }
  
  },  [selectedOption])
  return (
    <div className={clsx("col-span-full", className)}>
      <Combobox as="div" value={selectedOption} onChange={setSelectedOption}>
        <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </Combobox.Label>
        <div className="relative mt-2">
          {options && options.length > 0 && (
            <Combobox.Options className="absolute z-10 bottom-2 mb-8 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option) => (
                <Combobox.Option
                  key={option.id}
                  value={option}
                  className={({ active }) =>
                    clsx(
                      "relative cursor-default select-none py-2 pl-8 pr-4",
                      active ? "bg-primary text-white" : "text-gray-900"
                    )
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <span
                        className={clsx(
                          "block truncate",
                          selected && "font-semibold"
                        )}
                      >
                        {option.name}
                      </span>

                      {selected && (
                        <span
                          className={clsx(
                            "absolute inset-y-0 left-0 flex items-center pl-1.5",
                            active ? "text-white" : "text-indigo-600"
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
          {!disabled && (
            <Combobox.Input
              disabled={disabled}
              className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(event) => onChangeInput(event.target.value)}
              displayValue={(selectedOption) => selectedOption?.name}
            />
          )}
          <TextInput
            type={disabled ? "text" : "hidden"}
            value={(selected) => {
              console.log(selected);
              return selected?.name
            }}
            disabled={true}
          />
          <input type="hidden" name={id} id={id} value={selectedOption?.id} />
          {!disabled && (
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          )}
        </div>
      </Combobox>
    </div>
  );
}

export default SelectInput;
