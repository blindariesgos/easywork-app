import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import clsx from "clsx";

const IconDropdown = ({
  options,
  width,
  icon,
  colorIcon = "text-primary",
  disabled,
  excel,
  children,
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left mt-1">
      <MenuButton className="inline-flex w-full focus:ring-0 outline-none focus:outline-none">
        {icon}
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom end"
        className={`mt-2 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none z-50 ${width} ${disabled ? "bg-gray-200" : "bg-white"}`}
      >
        <div className="px-1 py-1 ">
          {excel && (
            <div className="pl-2 mb-1">
              <p className="text-sm font-bold text-primary">{excel}</p>
            </div>
          )}
          {options &&
            options.map((opt, index) => {
              return opt.options ? (
                <Menu as="div" className="relative inline-block text-left mt-1">
                  <MenuButton className="group flex w-full items-center gap-3 cursor-pointer data-[disabled]:cursor-auto rounded-md px-2 py-2 text-sm text-primary  data-[disabled]:text-gray-50">
                    {opt.icon && (
                      <opt.icon
                        className={`h-4 w-4 group-data-[focus]:text-white ${colorIcon}`}
                      />
                    )}
                    {opt.name}
                  </MenuButton>
                  <MenuItems
                    transition
                    anchor="right start"
                    className={`mt-2 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none z-50 ${width} ${disabled ? "bg-gray-200" : "bg-white"}`}
                  >
                    <div className="px-1 py-1 ">
                      {opt.options &&
                        opt.options.map((opt1, index) => (
                          <MenuItem
                            key={index}
                            className={clsx(
                              "group flex w-full items-center gap-3 cursor-pointer data-[disabled]:cursor-auto rounded-md px-2 py-2 text-sm text-primary  data-[disabled]:text-gray-50"
                            )}
                            disabled={disabled || opt1.disabled}
                            onClick={opt1.onClick}
                            as={"div"}
                          >
                            {opt1.icon && (
                              <opt1.icon
                                className={`h-4 w-4 group-data-[focus]:text-white ${colorIcon}`}
                              />
                            )}
                            {opt1.name}
                          </MenuItem>
                        ))}
                      {children}
                    </div>
                  </MenuItems>
                </Menu>
              ) : (
                <MenuItem
                  key={index}
                  className={clsx(
                    "group flex w-full items-center gap-3 cursor-pointer data-[disabled]:cursor-auto rounded-md px-2 py-2 text-sm text-primary  data-[disabled]:text-gray-50"
                  )}
                  disabled={disabled || opt.disabled}
                  onClick={opt.onClick}
                  as={"div"}
                >
                  {opt.icon && (
                    <opt.icon
                      className={`h-4 w-4 group-data-[focus]:text-white ${colorIcon}`}
                    />
                  )}
                  {opt.name}
                </MenuItem>
              );
            })}
          {children}
        </div>
      </MenuItems>
    </Menu>
  );
};

export default IconDropdown;
