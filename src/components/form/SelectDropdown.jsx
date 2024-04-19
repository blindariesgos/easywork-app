// SelectDropdown.js
"use client";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
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
  setValue
}) {
  const registerInput = register && register(name);
  const [selected, setSelected] = useState(selectedOption);
  const [query, setQuery] = useState("");
  

  useEffect(()=>{
    if (selectedOption) {
      setSelected(selectedOption)
    }  
  },  [selectedOption])

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
    <div className="">
      <Combobox as="div" value={selected} onChange={setSelected} disabled={disabled}>
        <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </Combobox.Label>
        <div className="relative mt-1">
          <div className="">
            <Combobox.Input
              // {...registerInput}
              className="w-full outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none border-none rounded-md drop-shadow-sm placeholder:text-xs focus:ring-0 text-sm"
              displayValue={(person) => person?.name || person?.username}
              onChange={(event) => {
                  // registerInput && registerInput.onChange(event);
                  setQuery(event.target.value);
                }
              }
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="grid grid-cols-2 absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {filteredElements?.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredElements.map((person) => (
                  <Combobox.Option                    
                    key={person.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-6 pr-4 ${
                        active ? 'bg-primary text-white rounded-md' : 'text-gray-900'
                      }`
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`flex items-center gap-2 w-full${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          <div className="w-[20%]">
                            <Image src={person.avatar} alt="" height={30} width={30} layout='fixed' objectFit='cover' className="rounded-full"/>
                          </div>
                          <div className={`flex flex-col leading-3 w-[80%]`}>
                            <p className={`text-[10px] font-medium ${active ? "text-white" : "text-black"}`}>{person.name || person?.username}</p>
                            <p className={`text-[10px] text-gray-50 ${active ? "text-white" : "text-black"} flex-wrap`}>{person.email}</p>
                            <p className={`text-[10px] text-gray-50 ${active ? "text-white" : "text-black"}`}>{person.phone}</p>
                          </div>
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-1 ${
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

export default SelectDropdown;
