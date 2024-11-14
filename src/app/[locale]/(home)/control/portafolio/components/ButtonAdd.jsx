import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Fragment, useState } from "react";
import AddPolicy from "./addPolicy";
import AddSchedule from "./addSchedule";
import AddRefunds from "./addRefunds";
import AddClaim from "./addClaim";
import { FaChevronDown } from "react-icons/fa";
import AddFundRescue from "./addFundRescue";
const ButtonAdd = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenClaim, setIsOpenClaim] = useState(false);
  const [isOpenFundRescue, setIsOpenFundRescue] = useState(false);
  const [isOpenRefunds, setIsOpenRefunds] = useState(false);
  const [isOpenSchedule, setIsOpenSchedule] = useState(false);

  const options = [
    {
      name: "Póliza (casos nuevos - clientes existentes)",
      onclick: () => setIsOpen(true),
    },
    { name: "Programaciones", onclick: () => setIsOpenSchedule(true) },
    { name: "Reembolsos", onclick: () => setIsOpenRefunds(true) },
    { name: "Renovaciones", disabled: true },
    { name: "Rescate de fondos", onclick: () => setIsOpenFundRescue(true) },
    { name: "Siniestros", onclick: () => setIsOpenClaim(true) },
  ];

  return (
    <Fragment>
      <Menu>
        <MenuButton className="py-2 px-4 bg-primary hover:bg-easy-500 text-white disabled:opacity-50 shadow-sm text-sm flex items-center gap-x-2 rounded-md  font-medium outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 justify-center">
          Añadir
          <FaChevronDown className="w-4 h-4" />
        </MenuButton>
        <MenuItems
          transition
          anchor="bottom start"
          className="rounded-md mt-2 bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 grid grid-cols-1 gap-2 p-2 "
        >
          {options.map((option, index) => (
            <MenuItem
              key={index}
              as="div"
              onClick={option.onclick && option.onclick}
              disabled={option.disabled}
              className="px-2 py-1 hover:[&:not(data-[disabled])]:bg-gray-100 rounded-md text-sm cursor-pointer data-[disabled]:cursor-auto data-[disabled]:text-gray-50"
            >
              {option.name}
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
      <AddPolicy isOpen={isOpen} setIsOpen={setIsOpen} />
      <AddClaim isOpen={isOpenClaim} setIsOpen={setIsOpenClaim} />
      <AddSchedule isOpen={isOpenSchedule} setIsOpen={setIsOpenSchedule} />
      <AddRefunds isOpen={isOpenRefunds} setIsOpen={setIsOpenRefunds} />
      <AddFundRescue
        isOpen={isOpenFundRescue}
        setIsOpen={setIsOpenFundRescue}
      />
    </Fragment>
  );
};

export default ButtonAdd;
