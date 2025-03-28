"use client";
import { useState } from "react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  Label,
  ComboboxOptions,
  ComboboxOption,
  Field,
} from "@headlessui/react";
import clsx from "clsx";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ComboBox({ label, data, selected, setSelected }) {
  const [query, setQuery] = useState("");

  const filteredData =
    query === ""
      ? data
      : data.filter((dato) => {
          return dato.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox as="div" value={selected} onChange={setSelected}>
      <Label
        className={clsx(
          label ? "block" : "hidden",
          "text-sm font-medium leading-6 text-gray-900"
        )}
      >
        {label}
      </Label>
      <div className="relative mt-2">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(dato) => dato?.name}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </ComboboxButton>

        {filteredData.length > 0 && (
          <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredData.map((dato) => (
              <ComboboxOption
                key={dato.name}
                value={dato}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-primary text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        "block truncate",
                        selected && "font-semibold"
                      )}
                    >
                      {dato.name}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-indigo-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
}

export function ComboBoxWithElement({ data, selected, setSelected, disabled }) {
  const [query, setQuery] = useState("");

  const filteredData =
    query === ""
      ? data
      : data.filter((dato) => {
          return dato.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Field disabled={disabled}>
      <Combobox as="div" value={selected} onChange={setSelected}>
        <div className="relative mt-2">
          <ComboboxInput
            className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(dato) => dato?.name}
          />
          {!disabled && (
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
              <ChevronDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </ComboboxButton>
          )}

          {filteredData.length > 0 && (
            <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredData.map((dato) => (
                <ComboboxOption
                  key={dato.name}
                  value={dato}
                  className={({ active }) =>
                    classNames(
                      "relative cursor-default select-none py-2 pl-3 pr-9",
                      active ? "bg-primary text-white" : "text-gray-900"
                    )
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <div className="flex items-center">
                        <span
                          className={classNames(
                            "inline-block h-2 w-2 flex-shrink-0 rounded-full bg-green-400"
                          )}
                          aria-hidden="true"
                        />
                        <span
                          className={classNames(
                            "ml-3 truncate",
                            selected && "font-semibold"
                          )}
                        >
                          {dato.name}
                        </span>
                      </div>

                      {selected && (
                        <span
                          className={classNames(
                            "absolute inset-y-0 right-0 flex items-center pr-4",
                            active ? "text-white" : "text-indigo-600"
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          )}
        </div>
      </Combobox>
    </Field>
  );
}
