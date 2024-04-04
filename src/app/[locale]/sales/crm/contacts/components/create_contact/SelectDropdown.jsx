// SelectDropdown.js
"use client";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import React, { Fragment, useEffect, useState } from "react";

function SelectDropdown({
  label,
  selectedOption,
  options,
  onChangeInput,
  query,
  disabled,
  register,
  name,
  error
}) {

  const [selected, setSelected] = useState(selectedOption);
  

  useEffect(()=>{
    if (selectedOption) {
      setSelected(selectedOption)
    }
  
  },  [selectedOption])
  // console.log("field", field)
  

  return (
    <div className="">
      <Combobox as="div" value={selected} onChange={setSelected}>
        <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </Combobox.Label>
        <div className="relative mt-1">
          <div className="">
            <Combobox.Input
              {...register(name)}
              className="w-full outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none border-none rounded-md drop-shadow-sm placeholder:text-xs focus:ring-0 text-sm"
              displayValue={(person) => person?.name}
              onChange={(event) => {
                  onChangeInput(event.target.value);
                }
              }
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
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
            afterLeave={() => onChangeInput('')}
          >
            <Combobox.Options className="grid grid-cols-2 absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {options?.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                options.map((person) => (
                  <Combobox.Option
                    disabled={disabled}
                    key={person.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-6 pr-4 ${
                        active ? 'bg-primary text-white' : 'text-gray-900'
                      }`
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`flex items-center gap-2 ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          <div>
                            <Image src={person.image} alt="" height={25} width={25} layout='fixed' objectFit='cover' className="rounded-full"/>
                          </div>
                          <div className="flex flex-col leading-3">
                            <p className="text-[10px] font-medium text-black">{person.name}</p>
                            <p className="text-[10px] text-gray-50">{person.email}</p>
                            <p className="text-[10px] text-gray-50">{person.phone}</p>
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
