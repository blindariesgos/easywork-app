import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Fragment, useState } from "react";
import AddPolicy from "./addPolicy";
import AddPolicyManual from "@/src/components/AddPolicyManual";
import AddSchedule from "./addSchedule";
import AddRefunds from "./addRefunds";
import AddClaim from "./addClaim";
import { FaChevronDown } from "react-icons/fa";
import AddFundRescue from "./addFundRescue";
import AddRenovations from "./addRenovations";
import AddVersion from "./addVersion";

const ButtonAdd = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenManual, setIsOpenManual] = useState(false);
  const [isOpenRenovation, setIsOpenRenovation] = useState(false);
  const [isOpenClaim, setIsOpenClaim] = useState(false);
  const [isOpenFundRescue, setIsOpenFundRescue] = useState(false);
  const [isOpenRefunds, setIsOpenRefunds] = useState(false);
  const [isOpenSchedule, setIsOpenSchedule] = useState(false);
  const [isOpenVersion, setIsOpenVersion] = useState(false);

  const options = [
    {
      name: "Póliza",
      onclick: () => setIsOpen(true),
    },
    { name: "Programación", onclick: () => setIsOpenSchedule(true) },
    { name: "Reembolso", onclick: () => setIsOpenRefunds(true) },
    { name: "Renovación", onclick: () => setIsOpenRenovation(true) },
    {
      name: "Rescate de fondos",
      onclick: () => setIsOpenFundRescue(true),
      disabled: true,
    },
    { name: "Siniestro", onclick: () => setIsOpenClaim(true), disabled: true },
    { name: "Versión", onclick: () => setIsOpenVersion(true) },
    { name: "Carga manual", onclick: () => setIsOpenManual(true) },
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
      <AddPolicyManual
        isOpen={isOpenManual}
        setIsOpen={setIsOpenManual}
        module="gestion"
      />
      <AddRenovations
        isOpen={isOpenRenovation}
        setIsOpen={setIsOpenRenovation}
      />
      <AddVersion isOpen={isOpenVersion} setIsOpen={setIsOpenVersion} />
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
