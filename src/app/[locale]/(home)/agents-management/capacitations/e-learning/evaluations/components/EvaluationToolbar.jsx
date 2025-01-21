import { Switch } from '@headlessui/react';
import { FiCopy, FiTrash } from 'react-icons/fi';

import Button from '@/src/components/form/Button';

export const EvaluationToolbar = () => {
  return (
    <div className="flex flex-wrap items-center justify-between mt-4">
      <div className="flex items-center justify-center gap-1">
        <Button label="Clave de respuesta" type="button" buttonStyle="primary" className="px-3 py-2 text-lg rounded-md" />
        <span>(0 puntos)</span>
      </div>
      <div>
        <div className="flex items-center justify-center gap-2">
          <p>Obligatoria</p>
          <Switch className="group relative flex h-5 w-12 cursor-pointer rounded-full bg-gray-300 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-easy-300">
            <span
              aria-hidden="true"
              className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
            />
          </Switch>
        </div>
      </div>
      <div>
        <button className="flex items-center justify-start gap-2">
          <FiCopy size="18px" /> <span>Duplicar</span>
        </button>
      </div>
      <div>
        <button className="flex items-center justify-start gap-2">
          <FiTrash size="18px" /> <span>Eliminar</span>
        </button>
      </div>
    </div>
  );
};
