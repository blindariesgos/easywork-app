import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import { useUserPermissions } from '../../hooks/useUserPermissions';
import { LMS_PERMISSIONS } from '../../constants';

export const CourseCardMoreMenu = ({ onEditCourse, onMoveCourse, onDeleteCourse }) => {
  const { hasPermission } = useUserPermissions();

  return (
    <Menu as="div" className="w-auto rounded-full bg-white opacity-70 absolute right-1 top-1 z-50 hover:opacity-100 transition">
      <MenuButton
        className="flex items-center p-1.5"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <EllipsisHorizontalIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </MenuButton>

      <MenuItems transition anchor="bottom end" className="z-50 mt-2.5 w-32 rounded-md bg-white py-2 shadow-lg focus:outline-none">
        {hasPermission(LMS_PERMISSIONS.coursesMoreMenuEdit) && (
          <MenuItem onClick={onEditCourse}>
            <div className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer hover:bg-gray-400 hover:text-white">Editar</div>
          </MenuItem>
        )}
        {hasPermission(LMS_PERMISSIONS.coursesMoreMenuMove) && (
          <MenuItem onClick={onMoveCourse}>
            <div className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer hover:bg-gray-400 hover:text-white">Mover</div>
          </MenuItem>
        )}
        {hasPermission(LMS_PERMISSIONS.coursesMoreMenuDelete) && (
          <MenuItem onClick={onDeleteCourse}>
            <div className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer hover:bg-gray-400 hover:text-white">Eliminar</div>
          </MenuItem>
        )}
      </MenuItems>
    </Menu>
  );
};
