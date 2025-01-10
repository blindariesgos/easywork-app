import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';

import Link from 'next/link';

export default function ModuleCardMoreMenu({ onEditCourse, onMoveCourse, onDeleteCourse }) {
  return (
    <Menu as="div" className="w-10 md:w-auto rounded-full bg-white shadow-lg absolute right-1 top-1 z-50 ">
      <MenuButton
        className="flex items-center p-1.5"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <EllipsisHorizontalIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </MenuButton>

      <MenuItems transition anchor="bottom end" className="z-50 mt-2.5 w-32 rounded-md bg-white py-2 shadow-lg focus:outline-none">
        <MenuItem onClick={onEditCourse}>
          <div className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer hover:bg-gray-400 hover:text-white">Editar</div>
        </MenuItem>
        <MenuItem onClick={onMoveCourse}>
          <div className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer hover:bg-gray-400 hover:text-white">Mover</div>
        </MenuItem>
        <MenuItem onClick={onDeleteCourse}>
          <div className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer hover:bg-gray-400 hover:text-white">Eliminar</div>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
