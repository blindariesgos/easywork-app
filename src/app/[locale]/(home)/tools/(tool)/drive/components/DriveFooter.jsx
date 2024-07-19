"use client";
import useDriveContext from "@/src/context/drive";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'

import clsx from 'clsx'
import { useEffect, useState } from "react";
const itemsByPage = [
    {
        id: 5,
        name: "5"
    },
    {
        id: 10,
        name: "10"
    },
    {
        id: 25,
        name: "25"
    },
    {
        id: 50,
        name: "50"
    },
    {
        id: 100,
        name: "100"
    }
]


const DriveFooter = ({ selectedFiles }) => {
    const { totals, config, setConfig } = useDriveContext();
    const [selected, setSelected] = useState(25);

    const handleNextPage = () => {
        if (config.page == totals.totalPages) return;
        setConfig({
            ...config,
            page: config.page + 1
        })
    }

    const handlePrevPage = () => {
        if (config.page == 1) return;
        setConfig({
            ...config,
            page: config.page - 1
        })
    }

    useEffect(() => {
        setConfig({
            ...config,
            limit: selected
        })
    }, [selected])

    return (
        <div className="flex justify-between items-center">
            <div className="ml-6">Seleccionado: {selectedFiles}/{totals.totalItems}</div>
            <div className="flex gap-1 items-center">
                <p>Mostrar:</p>
                <Listbox value={selected} onChange={setSelected} as="div">
                    <ListboxButton
                        className={clsx(
                            'relative block w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6',
                            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2'
                        )}
                    >
                        {selected}
                        <ChevronDownIcon
                            className="group pointer-events-none absolute top-2.5 right-2.5 size-4 "
                            aria-hidden="true"
                        />
                    </ListboxButton>
                    <ListboxOptions
                        anchor="bottom"
                        transition
                        className={clsx(
                            'rounded-xl border border-white p-1 focus:outline-none bg-white shadow-2xl',
                            'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                        )}
                    >
                        {itemsByPage.map((page) => (
                            <ListboxOption
                                key={page.name}
                                value={page.id}
                                className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-primary data-[focus]:text-white"
                            >
                                <CheckIcon className="invisible size-4 group-data-[selected]:visible" />
                                <div className="text-sm/6">{page.name}</div>
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </Listbox>
            </div>
            <p>{`Página ${config.page}/${totals.totalPages}`}</p>
            <div className="flex items-center gap-2">
                <div className="flex cursor-pointer" onClick={handlePrevPage}>
                    <ChevronLeftIcon className="h-6 w-6 mr-2 text-easywork-main" />
                    anterior
                </div>
                <div className="flex cursor-pointer" onClick={handleNextPage}>
                    siguiente
                    <ChevronRightIcon className="h-6 w-6 ml-2 text-easywork-main" />
                </div>
            </div>
        </div>
    );
}

export default DriveFooter