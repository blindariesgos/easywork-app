import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';

export default function LessonMoreMenu({ itemType, actions }) {
  const menuItems = {
    course: [
      { id: 'editCourse', label: 'Editar curso' },
      { id: 'addNewLesson', label: 'Agregar carpeta' },
      { id: 'addNewPage', label: 'Agregar página' },
      { id: 'deleteCourse', label: 'Eliminar curso' },
    ],
    lesson: [
      { id: 'addNewPage', label: 'Agregar página a la carpeta' },
      { id: 'editLesson', label: 'Editar carpeta' },
      { id: 'deleteLesson', label: 'Eliminar carpeta' },
    ],
    page: [
      { id: 'editPage', label: 'Editar página' },
      { id: 'duplicatePage', label: 'Duplicar página' },
      { id: 'changeLesson', label: 'Cambiar carpeta' },
      { id: 'deletePage', label: 'Eliminar página' },
    ],
  };

  return (
    <Menu as="div" className="w-10 md:w-auto absolute right-1 top-1 z-50 ">
      <MenuButton className="flex items-center p-1.5">
        <EllipsisHorizontalIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </MenuButton>

      <MenuItems transition anchor="bottom end" className="z-50 mt-2.5 w-42 rounded-md bg-white py-2 shadow-lg focus:outline-none">
        {menuItems[itemType].map(item => (
          <MenuItem key={item.id} onClick={actions[item.id]}>
            <div className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer hover:bg-gray-400 hover:text-white">{item.label}</div>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
