import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { ArrowDownCircleIcon } from '@heroicons/react/20/solid';

export default function ContentViewTextEditorMoreMenu({ onTranscript, onAttachFile }) {
  return (
    <Menu as="div" className="w-10 md:w-auto">
      <MenuButton className="flex items-center justify-center py-2 px-4 bg-[#f5f5f5] hover:bg-[#e4e4e4] shadow-xs text-sm gap-2 rounded-md">
        <p>Agregar</p>
        <ArrowDownCircleIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </MenuButton>

      <MenuItems transition anchor="bottom end" className="z-50 mt-2.5 w-42 rounded-md bg-white py-2 shadow-lg focus:outline-none">
        {/* <MenuItem onClick={onAttachFile}>
          <div className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer hover:bg-gray-400 hover:text-white">Imagen</div>
        </MenuItem> */}
        <MenuItem onClick={onTranscript}>
          <div className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer hover:bg-gray-400 hover:text-white">Transcripción</div>
        </MenuItem>
        <MenuItem onClick={onAttachFile}>
          <div className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer hover:bg-gray-400 hover:text-white">Archivo / Documento</div>
        </MenuItem>
        {/* <MenuItem onClick={onDeleteCourse}>
          <div className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer hover:bg-gray-400 hover:text-white">Hipervínculo</div>
        </MenuItem> */}
      </MenuItems>
    </Menu>
  );
}
