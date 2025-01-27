import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { EllipsisHorizontalIcon, TrashIcon, ArrowLeftCircleIcon, ArrowRightCircleIcon, UserPlusIcon, PencilSquareIcon } from '@heroicons/react/20/solid';
import { useUserPermissions } from '../../hooks/useUserPermissions';
import { LMS_PERMISSIONS } from '../../constants';

export const CourseCardMoreMenu = ({ isFirstChild, isLastChild, onEditCourse, onAssignCourse, onMoveCourse, onDeleteCourse }) => {
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

      <MenuItems transition anchor="bottom end" className="z-50 mt-2.5 w-auto rounded-md bg-white shadow-xl focus:outline-none">
        {hasPermission(LMS_PERMISSIONS.coursesMoreMenuEdit) && (
          <MenuItem onClick={onEditCourse}>
            <div className="flex items-center gap-1 p-2 text-sm leading-6 text-black cursor-pointer hover:bg-[#e0e0e0]">
              <PencilSquareIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <span>Editar</span>
            </div>
          </MenuItem>
        )}
        {hasPermission(LMS_PERMISSIONS.coursesMoreMenuMove) && !isLastChild && (
          <MenuItem onClick={() => onMoveCourse('up')}>
            <div className="flex items-center gap-1 p-2 text-sm leading-6 text-black cursor-pointer hover:bg-[#e0e0e0]">
              <ArrowRightCircleIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <span>Mover a la derecha</span>
            </div>
          </MenuItem>
        )}
        {hasPermission(LMS_PERMISSIONS.coursesMoreMenuMove) && !isFirstChild && (
          <MenuItem onClick={() => onMoveCourse('down')}>
            <div className="flex items-center gap-1 p-2 text-sm leading-6 text-black cursor-pointer hover:bg-[#e0e0e0]">
              <ArrowLeftCircleIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <span>Mover a la izquierda</span>
            </div>
          </MenuItem>
        )}
        <MenuItem onClick={onAssignCourse}>
          <div className="flex items-center gap-1 p-2 text-sm leading-6 text-black cursor-pointer hover:bg-[#e0e0e0]">
            <UserPlusIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            <span>Asignar agente</span>
          </div>
        </MenuItem>
        {hasPermission(LMS_PERMISSIONS.coursesMoreMenuDelete) && (
          <MenuItem onClick={onDeleteCourse}>
            <div className="flex items-center gap-1 p-2 text-sm leading-6 text-black cursor-pointer hover:bg-[#e0e0e0]">
              <TrashIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <span>Eliminar</span>
            </div>
          </MenuItem>
        )}
      </MenuItems>
    </Menu>
  );
};
