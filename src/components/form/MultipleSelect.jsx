import React, { useState } from 'react';
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useTranslation } from 'react-i18next';
import Image from "next/image";

const MultipleSelect = ({ options, getValues, setValue, name, label, error }) => {
    const { t } = useTranslation(); 
    const [isOpen, setIsOpen] = useState(false);
    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (option) => {
        const array = getValues(name);
        const index = array.findIndex((res) => res.id === option.id);
        if (index === -1) {
            setValue(name, [...array, option], { shouldValidate: true });
        } else {
            const updatedResponsible = array.filter((res) => res.id !== option.id);
            setValue(name, updatedResponsible, { shouldValidate: true });
        }
    };

    const handleRemove = (id) => {
        const updatedResponsible = getValues(name).filter((res) => res.id !== id);
        setValue(name, updatedResponsible, { shouldValidate: true });
    };

    return (
        <div className="">
            <label className='text-sm font-medium leading-6 text-gray-900'>
                {label}
            </label>
            <div className='relative mt-1'>
                <button
                    type="button"
                    onClick={handleToggle}
                    className="text-left w-full outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none border-none rounded-md drop-shadow-sm placeholder:text-xs focus:ring-0 text-sm bg-white py-2"
                >
                    <span className="ml-2 text-gray-60 flex gap-1 flex-wrap">
                        {getValues(name)?.length > 0
                            ? getValues(name).map((res) => (
                                    <div key={res.id} className="bg-easy-1000 p-1 rounded-md text-white flex gap-2 items-center">
                                        {res.name}
                                        <button
                                            type="button"
                                            onClick={() => handleRemove(res.id)}
                                            className="text-white"
                                        >
                                            <XMarkIcon className='h-3 w-3 text-white'/>
                                        </button>
                                    </div>
                                ))
                            : t('common:select')}
                    </span>
                    <span className="absolute top-0 right-1 mt-2.5 flex items-center pr-2 pointer-events-none">
                        <ChevronDownIcon className="h-4 w-4"/>
                    </span>
                </button>
                {isOpen && (
                    <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-50">
                        <div className="py-1 grid grid-cols-2 gap-2" aria-labelledby="options-menu">
                            {options.map((option) => (
                                <div
                                    key={option.id}
                                    className={`flex items-center px-4 py-2 text-sm cursor-pointer rounded-md ${
                                        getValues(name).some((res) => res.id === option.id) ? 'bg-easy-1100' : ''
                                    }`}
                                    onClick={() => handleSelect(option)}
                            >
                                    {option.image && (
                                        <Image
                                            src={option.image}
                                            width={100}
                                            height={100}
                                            alt={`${option.name} avatar`}
                                            className="w-6 h-6 rounded-full mr-2"
                                        />
                                    )}
                                    <span className={`${getValues(name).some((res) => res.id === option.id) ? "text-white" : "text-black"}`}>{option.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
        </div>
    );
};
export default MultipleSelect;
  