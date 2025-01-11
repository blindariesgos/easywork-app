import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import Link from 'next/link';
import { E_LEARNING_BASE_ROUTE } from '../constants';

export const EvaluationMenuDropdown = () => {
  return (
    <Menu as="div" className="hover:bg-slate-50/30 w-10 md:w-auto rounded-lg">
      <MenuButton className="flex items-center p-1.5">
        <div className="rounded py-1 px-2 cursor-pointer bg-gray-100">
          <span>Evaluaciones</span>
        </div>
      </MenuButton>

      <MenuItems transition anchor="bottom end" className="z-50 mt-2.5 w-48 rounded-md bg-white py-2 shadow-lg focus:outline-none">
        <MenuItem>
          <div className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer hover:bg-gray-400 hover:text-white">
            <Link href={`${E_LEARNING_BASE_ROUTE}/evaluations`}>Crear evaluación</Link>
          </div>
        </MenuItem>
        <MenuItem>
          <div className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer hover:bg-gray-400 hover:text-white">
            <Link href={`${E_LEARNING_BASE_ROUTE}/tests`}>Lista de pruebas</Link>
          </div>
        </MenuItem>
        <MenuItem>
          <div className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer hover:bg-gray-400 hover:text-white">
            <Link href={`${E_LEARNING_BASE_ROUTE}/certificates`}>Certificados</Link>
          </div>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};
