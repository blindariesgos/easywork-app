import {
  Menu,
  Transition,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const ButtonGeneratePolicy = ({ options, label }) => {
  return (
    <Menu as="div" className="relative inline-block text-left z-50">
      <div>
        <MenuButton className="inline-flex w-full justify-center rounded-md text-sm font-medium text-white bg-green-500 py-2 px-3 focus:outline-none focus:ring-0">
          {label}
          <ChevronDownIcon className="ml-2 h-5 w-5 text-white" />
        </MenuButton>
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
        <MenuItems className="absolute right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50 w-60">
          <div className="px-1 py-1 ">
            {options.map((opt, index) => (
              <MenuItem key={index}>
                {({ active }) => (
                  <button
                    className={`${
                      active ? " text-white bg-easy-600" : "text-gray-400"
                    } group flex w-full justify-start gap-3 rounded-md px-2 py-2 text-sm font-medium`}
                  >
                    {opt.name}
                  </button>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default ButtonGeneratePolicy;
