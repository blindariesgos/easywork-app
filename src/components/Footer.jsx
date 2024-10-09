"use client";
import React, { useState, useEffect, Fragment } from "react";
import { MenuButton, MenuItem, MenuItems, Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Footer() {
  const language = ["Español", "English"];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="mt-2 w-full flex justify-center">
      <ul className="flex w-96 justify-between ml-5 max-md:hidden text-xs">
        <li className="cursor-pointer">© 2024 Easywork</li>
        <span>|</span>
        <li className="cursor-pointer">Soporte Easy</li>
        <span>|</span>
        <li className="cursor-pointer">Temas</li>
        <span>|</span>
        <Menu as="div" className="flex items-center relative">
          <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <li className="cursor-pointer flex">
              <p>Idioma</p>
              <ChevronDownIcon
                className={`ml-1 h-4 w-4 ${isMenuOpen ? "rotate-180 transition-transform duration-300" : "transition-transform duration-300"}`}
              />
            </li>
          </MenuButton>
          <MenuItems
            transition
            anchor="bottom end"
            className="z-50 w-32 rounded-md bg-white py-2 shadow-lg focus:outline-none"
          >
            {language?.map((item, index) => (
              <MenuItem key={index}>
                {({ active }) => (
                  <div
                    className={classNames(
                      active ? "bg-gray-50" : "",
                      "block px-3 py-1 text-sm leading-6 text-black cursor-pointer"
                    )}
                  >
                    {item}
                  </div>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
      </ul>
    </div>
  );
}
