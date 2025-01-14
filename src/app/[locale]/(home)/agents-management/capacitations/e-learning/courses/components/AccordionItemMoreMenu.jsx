import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';

export const AccordionItemMoreMenu = ({ itemType, actions }) => {
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
    <Menu as="div" className="w-auto">
      <MenuButton className="align-middle" onClick={e => e.stopPropagation()}>
        <EllipsisHorizontalIcon className="w-8 text-gray-400" aria-hidden="true" />
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
};
