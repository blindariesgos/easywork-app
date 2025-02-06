import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { FiCopy, FiTrash, FiEdit, FiMoreVertical, FiArrowDownCircle, FiArrowUpCircle } from 'react-icons/fi';

export const EvaluationQuestionHeader = ({ title, description = '', onMove, onEdit, onDelete, onDuplicate, isFirstQuestion, isLastQuestion }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        {description && <p className="text-sm">{description}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={onEdit}>
          <FiEdit size="16px" />
        </button>

        <Menu as="div" className="w-auto">
          <MenuButton className="align-middle" onClick={e => e.stopPropagation()}>
            <FiMoreVertical size="20px" />
          </MenuButton>

          <MenuItems transition anchor="bottom end" className="z-50 mt-2.5 w-42 rounded-md bg-white py-2 shadow-lg focus:outline-none">
            {/* <MenuItem
              as="div"
              onClick={e => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex items-center cursor-pointer p-2 gap-2 hover:bg-[#e0e0e0]"
            >
              <FiEdit size="20px" />
              <span>Editar</span>
            </MenuItem> */}
            <MenuItem
              as="div"
              className="flex items-center cursor-pointer p-2 gap-2 hover:bg-[#e0e0e0]"
              onClick={e => {
                e.stopPropagation();
                onDuplicate();
              }}
            >
              <FiCopy size="20px" />
              <span>Duplicar</span>
            </MenuItem>
            {!isFirstQuestion && (
              <MenuItem
                as="div"
                className="flex items-center cursor-pointer p-2 gap-2 hover:bg-[#e0e0e0]"
                onClick={e => {
                  e.stopPropagation();
                  onMove('up');
                }}
              >
                <FiArrowUpCircle size="20px" />
                <span>Mover arriba</span>
              </MenuItem>
            )}
            {!isLastQuestion && (
              <MenuItem
                as="div"
                className="flex items-center cursor-pointer p-2 gap-2 hover:bg-[#e0e0e0]"
                onClick={e => {
                  e.stopPropagation();
                  onMove('down');
                }}
              >
                <FiArrowDownCircle size="20px" />
                <span>Mover abajo</span>
              </MenuItem>
            )}
            <MenuItem
              as="div"
              className="flex items-center cursor-pointer p-2 gap-2 hover:bg-[#e0e0e0]"
              onClick={e => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <FiTrash size="20px" />
              <span>Eliminar</span>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
};
