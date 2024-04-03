"use client";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function SelectMenu({ label, data, value, setValue }) {
  return (
    <Listbox value={value} onChange={setValue}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
            {label}
          </Listbox.Label>
          <div className="relative mt-2">
            <Listbox.Button className="relative w-full min-w-72 cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
              <span className="flex items-center">
                <span
                  className={classNames(
                    "bg-green-400 inline-block h-2 w-2 flex-shrink-0 rounded-full"
                  )}
                />
                <span className="ml-3 block truncate">{value.name}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {data.map((dato) => (
                  <Listbox.Option
                    key={dato.id}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-indigo-600 text-white" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-3 pr-9 text-sm"
                      )
                    }
                    value={dato}
                  >
                    {({ value, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(
                              dato.online ? "bg-green-400" : "bg-gray-200",
                              "inline-block h-2 w-2 flex-shrink-0 rounded-full"
                            )}
                            aria-hidden="true"
                          />
                          <span
                            className={classNames(
                              value ? "font-semibold" : "font-normal",
                              "ml-3 block truncate"
                            )}
                          >
                            {dato.name}
                            <span className="sr-only">
                              {" "}
                              is {dato.online ? "online" : "offline"}
                            </span>
                          </span>
                        </div>

                        {value ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
