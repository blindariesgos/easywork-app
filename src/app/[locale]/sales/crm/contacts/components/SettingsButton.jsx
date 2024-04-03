import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronDownIcon, Cog8ToothIcon } from '@heroicons/react/20/solid'
import { TbEditCircle } from 'react-icons/tb'

const SettingsButton = ({options}) => {
    return (
        <div className="">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="inline-flex w-full">
                        <Cog8ToothIcon
                            className="h-8 w-8 text-primary"
                            aria-hidden="true"
                        />
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                        <div className="px-1 py-1 ">
                            {options.map((opt, index) => (
                                <Menu.Item key={index}>
                                    {({ active }) => (
                                        <button
                                            className={`${
                                            active ? ' text-white bg-easy-600' : 'text-gray-400'
                                            } group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm`}
                                        >
                                            <opt.icon className={`h-6 w-6 ${active ? "text-white" : "text-primary"}`}/>
                                            {opt.name}
                                        </button>
                                    )}
                                </Menu.Item>
                            ))}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    )
}

export default SettingsButton