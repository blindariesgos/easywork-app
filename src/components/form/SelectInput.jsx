// SelectInput.js
"use client";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import React, { Fragment, useEffect, useState } from "react";

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
  value
}) {

  const [selected, setSelected] = useState();
  const [query, setQuery] = useState("");  

  useEffect(()=>{
    if (selectedOption) {
      setSelected(selectedOption)
    }  
  },  [selectedOption])

  useEffect(() => {
    if (selected) setValue && setValue(name, object ? selected : selected.id);
  }, [selected, setValue, name])

  const filteredElements =
    query === ""
      ? options
      : options.filter((element) => {
          return element.name.toLowerCase().includes(query.toLowerCase());
        });
  
  

  return (
    <div className="w-full">
      <Combobox as="div" value={selected} onChange={setSelected} disabled={disabled}>
        <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </Combobox.Label>
        <div className="relative mt-1">
            <Combobox.Input
              // {...register && register(name)}
              className={`z-50 w-full outline-none focus:outline-none focus:ring-0 rounded-md drop-shadow-sm placeholder:text-xs text-sm ${border ? "border border-gray-200 focus:ring-gray-200" : "border-none focus:ring-0 "}`}
              displayValue={(person) => person?.name}   
              value={value}           
              onChange={(event) => {
                  // register && register(name).onChange(event);
                  setQuery && setQuery(event.target.value);
                }
              }
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon
                className="h-5 w-5 text-primary"
                aria-hidden="true"
              />
            </Combobox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery && setQuery('')}
          >
            <Combobox.Options className="absolute z-50 bottom-2 mb-8 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredElements?.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredElements && filteredElements.map((person) => (
                  <Combobox.Option                    
                    key={person.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 px-2 ${
                        active ? 'bg-primary text-white' : 'text-gray-900'
                      }`
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate pl-6 ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {person.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-2 ${
                              active ? 'text-white' : 'text-primary'
                            }`}
                          >
                            <CheckIcon className="h-4 w-4" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>        
        {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
      </Combobox>
    </div>
  );
}

export default SelectInput;
