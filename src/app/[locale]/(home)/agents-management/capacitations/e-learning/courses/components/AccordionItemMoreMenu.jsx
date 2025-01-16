import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import { useUserPermissions } from '../../../hooks/useUserPermissions';
import { LMS_PERMISSIONS } from '../../../constants';

export const AccordionItemMoreMenu = ({ itemType, actions }) => {
  const { hasPermission } = useUserPermissions();

  const menuItems = {
    course: [
      { id: 'editCourse', label: 'Editar curso', permission: LMS_PERMISSIONS.editCourse },
      { id: 'addNewCourseFolder', label: 'Agregar carpeta', permission: LMS_PERMISSIONS.addFolder },
      { id: 'addNewPage', label: 'Agregar página', permission: LMS_PERMISSIONS.addPage },
      { id: 'deleteCourse', label: 'Eliminar curso', permission: LMS_PERMISSIONS.deleteCourse },
    ],
    folder: [
      { id: 'addNewPage', label: 'Agregar página a la carpeta', permission: LMS_PERMISSIONS.addPage },
      { id: 'editCourseFolder', label: 'Editar carpeta', permission: LMS_PERMISSIONS.editFolder },
      { id: 'deleteCourseFolder', label: 'Eliminar carpeta', permission: LMS_PERMISSIONS.deleteFolder },
    ],
    page: [
      { id: 'editPage', label: 'Editar página', permission: LMS_PERMISSIONS.editPage },
      { id: 'duplicatePage', label: 'Duplicar página', permission: LMS_PERMISSIONS.duplicatePage },
      { id: 'changeCourseFolder', label: 'Cambiar carpeta', permission: LMS_PERMISSIONS.changeFolder },
      { id: 'deletePage', label: 'Eliminar página', permission: LMS_PERMISSIONS.deletePage },
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
