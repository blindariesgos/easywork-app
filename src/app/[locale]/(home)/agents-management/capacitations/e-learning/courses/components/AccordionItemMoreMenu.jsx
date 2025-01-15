import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import { useUserPermissions } from '../../../hooks/useUserPermissions';

export const AccordionItemMoreMenu = ({ itemType, actions }) => {
  const { hasPermission } = useUserPermissions();

  const menuItems = {
    course: [
      { id: 'editCourse', label: 'Editar curso', permission: 'e-learning:courses:course-details:edit-course' },
      { id: 'addNewCourseFolder', label: 'Agregar carpeta', permission: 'e-learning:courses:course-details:add-lesson' },
      { id: 'addNewPage', label: 'Agregar página', permission: 'e-learning:courses:course-details:add-lesson-page' },
      { id: 'deleteCourse', label: 'Eliminar curso', permission: 'e-learning:courses:course-details:delete-course' },
    ],
    folder: [
      { id: 'addNewPage', label: 'Agregar página a la carpeta', permission: 'e-learning:courses:course-details:add-lesson-page' },
      { id: 'editCourseFolder', label: 'Editar carpeta', permission: 'e-learning:courses:course-details:add-lesson' },
      { id: 'deleteCourseFolder', label: 'Eliminar carpeta', permission: 'e-learning:courses:course-details:delete-lesson' },
    ],
    page: [
      { id: 'editPage', label: 'Editar página', permission: 'e-learning:courses:course-details:edit-lesson-page' },
      { id: 'duplicatePage', label: 'Duplicar página', permission: 'e-learning:courses:course-details:duplicate-lesson-page' },
      { id: 'changeCourseFolder', label: 'Cambiar carpeta', permission: 'e-learning:courses:course-details:change-lesson-page-folder' },
      { id: 'deletePage', label: 'Eliminar página', permission: 'e-learning:courses:course-details:delete-lesson-page' },
    ],
  };

  return (
    <Menu as="div" className="w-auto">
      <MenuButton className="align-middle">
        <EllipsisHorizontalIcon className="w-8 text-gray-400" aria-hidden="true" />
      </MenuButton>

      <MenuItems transition anchor="bottom end" className="z-50 mt-2.5 w-42 rounded-md bg-white py-2 shadow-lg focus:outline-none">
        {menuItems[itemType]?.map(
          item =>
            hasPermission(item.permission) && (
              <MenuItem key={item.id} onClick={actions[item.id]}>
                <div className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer hover:bg-gray-400 hover:text-white">{item.label}</div>
              </MenuItem>
            )
        )}
      </MenuItems>
    </Menu>
  );
};
