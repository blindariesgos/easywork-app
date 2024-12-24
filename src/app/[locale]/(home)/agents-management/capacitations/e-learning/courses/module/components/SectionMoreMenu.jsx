import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';

export default function SectionMoreMenu({ onEditCourse, onMoveCourse, onDeleteCourse }) {
  return (
    <Menu as="div" className="w-10 md:w-auto absolute right-1 top-1 z-50 ">
      <MenuButton className="flex items-center p-1.5">
        <EllipsisHorizontalIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </MenuButton>

      <MenuItems transition anchor="bottom end" className="z-50 mt-2.5 w-42 rounded-md bg-white py-2 shadow-lg focus:outline-none">
        <MenuItem onClick={onEditCourse}>
          <div className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer hover:bg-gray-400 hover:text-white">Editar carpeta</div>
        </MenuItem>
        <MenuItem onClick={onDeleteCourse}>
          <div className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer hover:bg-gray-400 hover:text-white">Eliminar carpeta</div>
        </MenuItem>
        <MenuItem onClick={onMoveCourse}>
          <div className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer hover:bg-gray-400 hover:text-white">Agregar página a la carpeta</div>
        </MenuItem>
        <MenuItem onClick={onMoveCourse}>
          <div className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer hover:bg-gray-400 hover:text-white">Duplicar</div>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
