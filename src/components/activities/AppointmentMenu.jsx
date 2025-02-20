import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const AppointmentMenu = ({ options, label }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center rounded-md text-sm font-medium text-gray-400 focus:outline-none uppercase">
          {label}
          <ChevronDownIcon
            className="ml-2 h-5 w-5 text-primary"
            aria-hidden="true"
          />
        </MenuButton>
      </div>

      <MenuItems
        transition
        anchor="bottom end"
        className="mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50"
      >
        <div className="px-1 py-1 ">
          {options.map((opt, index) => (
            <MenuItem key={index}>
              {({ active }) => (
                <button
                  className={`${
                    active ? " text-white bg-easy-600" : "text-gray-400"
                  } group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm uppercase font-medium`}
                >
                  {opt.name}
                </button>
              )}
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
};

export default AppointmentMenu;
