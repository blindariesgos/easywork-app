import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'

const IconDropdown = ({options, width, icon}) => {
    return (
        <Menu as="div" className="relative inline-block text-left mt-1">
            <div>
                <Menu.Button className="inline-flex w-full">
                    {icon}
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
                <Menu.Items className={`absolute right-0 mt-2 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50 ${width}`}>
                    <div className="px-1 py-1 ">
                        {options.map((opt, index) => (
                            <Menu.Item key={index}>
                                {({ active }) => (
                                    <button
                                        className={`${
                                        active ? ' text-white bg-easy-600' : 'text-primary'
                                        } group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm`}
                                    >
                                        {opt.icon && <opt.icon className={`h-4 w-4 ${active ? "text-white" : "text-primary"}`}/>}
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

export default IconDropdown