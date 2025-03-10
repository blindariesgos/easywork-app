"use client";
import { useState, useMemo } from "react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import clsx from "clsx";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function BaseComboBox({
  label,
  data,
  selected,
  setSelected,
  renderOption,
  disabled,
}) {
  const [query, setQuery] = useState("");

  const filteredData = useMemo(() => {
    return query === ""
      ? data
      : data.filter((dato) =>
          dato.name.toLowerCase().includes(query.toLowerCase())
        );
  }, [query, data]);

  return (
    <Combobox
      as="div"
      value={selected}
      onChange={setSelected}
      disabled={disabled}
    >
      <Combobox.Label
        className={clsx(
          label ? "block" : "hidden",
          "text-sm font-medium leading-6 text-gray-900"
        )}
      >
        {label}
      </Combobox.Label>
      <div className="relative mt-2">
        <Combobox.Input
          disabled={disabled}
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(dato) => dato?.name}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredData.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredData.map((dato) => (
              <Combobox.Option
                key={dato.name}
                value={dato}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-primary text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => renderOption(dato, active, selected)}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}

export function ComboBox({ label, data, selected, setSelected, disabled }) {
  return (
    <BaseComboBox
      label={label}
      data={data}
      disabled={disabled}
      selected={selected}
      setSelected={setSelected}
      renderOption={(dato, active, selected) => (
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
    />
  );
}

export function ComboBoxWithElement({
  label,
  data,
  selected,
  setSelected,
  disabled,
}) {
  return (
    <BaseComboBox
      label={label}
      data={data}
      selected={selected}
      disabled={disabled}
      setSelected={setSelected}
      renderOption={(dato, active, selected) => (
        <div className="flex items-center">
          <span
            className={classNames(
              "inline-block h-2 w-2 flex-shrink-0 rounded-full bg-green-400"
            )}
            aria-hidden="true"
          />
          <span
            className={classNames("ml-3 truncate", selected && "font-semibold")}
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
        </div>
      )}
    />
  );
}
