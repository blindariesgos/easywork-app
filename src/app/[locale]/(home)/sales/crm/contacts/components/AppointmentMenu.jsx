import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const AppointmentMenu = ({ options, label }) => {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md text-sm font-medium text-gray-400 focus:outline-none uppercase">
                    {label}
                    <ChevronDownIcon
                        className="ml-2 h-5 w-5 text-primary"
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
                <Menu.Items className="absolute right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                    <div className="px-1 py-1 ">
                        {options.map((opt, index) => (
                            <Menu.Item key={index}>
                                {({ active }) => (
                                    <button
                                        className={`${
                                        active ? ' text-white bg-easy-600' : 'text-gray-400'
                                        } group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm uppercase font-medium`}
                                    >
                                        {/* <opt.icon className={`h-6 w-6 ${active ? "text-white" : "text-primary"}`}/> */}
                                        {opt.name}
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

export default AppointmentMenu