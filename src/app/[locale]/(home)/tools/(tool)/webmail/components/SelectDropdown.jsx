// SelectDropdown.js
"use client";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { Fragment, useEffect, useState } from "react";
import { postLead } from "../../../../../../../lib/apis";

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
  setContactsArray,
}) {
  const session = useSession();
  const registerInput = register && register(name);
  const [selected, setSelected] = useState(selectedOption);
  const [query, setQuery] = useState("");
  const [contacts, setContacts] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (selectedOption) {
      setSelected(selectedOption);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (selected) setValue && setValue(selected?.email, selected?.id);
    if (selected) {
      setContacts((prevContacts) => [...prevContacts, selected?.email]);
    }
    setContactsArray(contacts);
  }, [selected, setValue, name]);

  const filteredElements =
    query === ""
      ? options
      : options.filter((element) => {
          return `${element.name} ${element.username}`
            .toLowerCase()
            .includes(query.toLowerCase());
        });

  const handleRemoveContact = (index) => {
    const updatedContacts = [...contacts];
    updatedContacts.splice(index, 1);
    setContacts(updatedContacts);
  };

  useEffect(() => {}, []);

  function isEmail(str) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(str);
  }

  async function okContact() {
    const data = {
      name: firstName,
      lastName,
      emails_dto: query,
      sourceId: "f3b92514-b763-4967-b46b-ac1ef323a2e6",
    };
    const response = await postLead(data);
    console.log(response);
  }

  return (
    <div className={className}>
      <Combobox
        as="div"
        value={selected}
        onChange={setSelected}
        disabled={disabled}
      >
        <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </Combobox.Label>
        <div className="relative mt-1">
          <div className="flex">
            <div className="bg-white flex items-center px-3 outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none border-none rounded-l-md drop-shadow-sm placeholder:text-xs focus:ring-0 text-sm">
              {contacts?.length > 0 &&
                contacts.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleRemoveContact(index)}
                    className="bg-easywork-main text-white p-2 h-6 mr-1 rounded-sm flex items-center cursor-pointer"
                  >
                    {item}
                  </div>
                ))}
            </div>
            <Combobox.Input
              // {...registerInput}
              className="w-full outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none border-none rounded-r-md drop-shadow-sm placeholder:text-xs focus:ring-0 text-sm"
              displayValue={(person) => person?.name || person?.username}
              onChange={(event) => {
                // registerInput && registerInput.onChange(event);
                setQuery(event.target.value);
              }}
            />
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="grid grid-cols-2 absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {filteredElements?.length === 0 && query !== "" ? (
                <div className="flex flex-row items-center justify-center cursor-default select-none px-4 py-2 text-gray-700">
                  <p>El mensaje será enviado al correo electrónico.</p>
                  <div className="flex">
                    <input
                      type="text"
                      className="py-2 text-sm rounded-md ml-2 w-full focus:text-gray-900 placeholder-slate-600"
                      placeholder="Primer nombre"
                      autoComplete="off"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                      type="text"
                      className="ml-3 py-2 text-sm rounded-md w-full focus:text-gray-900 placeholder-slate-600"
                      placeholder="Apellido"
                      autoComplete="off"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div className="ml-3 flex-row items-center justify-center">
                    <button
                      className="bg-easywork-main text-white p-3 rounded-md"
                      onClick={() => okContact()}
                    >
                      Ok
                    </button>
                  </div>
                </div>
              ) : (
                filteredElements &&
                filteredElements.map((option) => (
                  <Combobox.Option
                    key={option.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-6 pr-4 ${
                        active
                          ? "bg-primary text-white rounded-md"
                          : "text-gray-900"
                      }`
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`flex items-center gap-2 w-full${
                            selected ? "font-medium" : "font-normal"
                          }`}
                          onClick={() => setSelected("")}
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
                            <p
                              className={`text-[10px] font-medium ${active ? "text-white" : "text-black"}`}
                            >
                              {option.name || option?.username}
                            </p>
                            <p
                              className={`text-[10px] text-gray-50 ${active ? "text-white" : "text-black"} flex-wrap`}
                            >
                              {option.email}
                            </p>
                            {/* <p
                              className={`text-[10px] text-gray-50 ${active ? "text-white" : "text-black"}`}
                            >
                              {option.phone}
                            </p> */}
                          </div>
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-1 ${
                              active ? "text-white" : "text-primary"
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
