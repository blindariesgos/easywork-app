import { Switch } from '@headlessui/react';
import { FiCopy, FiTrash } from 'react-icons/fi';

import Button from '@/src/components/form/Button';

export const EvaluationQuestionToolbar = ({ hasAnswers = true, pointsCount = 0, isRequired, setIsRequired, onDuplicate, onDelete, onCancel }) => {
  console.log('🚀 ~ EvaluationQuestionToolbar ~ pointsCount:', pointsCount);
  return (
    <>
      <div className={`flex flex-wrap items-center justify-${hasAnswers ? 'between' : 'end gap-4'}`}>
        {hasAnswers && (
          <div className="flex items-center justify-center gap-1">
            {/* <Button label="Clave de respuesta" type="button" buttonStyle="primary" className="px-3 py-2 text-lg rounded-md" /> */}
            <span>{pointsCount} puntos</span>
          </div>
        )}
        {hasAnswers && (
          <div className="flex items-center justify-center gap-2">
            <p>Obligatoria</p>
            <Switch
              className="group relative flex h-5 w-12 cursor-pointer rounded-full bg-gray-300 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-easy-300"
              checked={isRequired}
              onChange={checked => setIsRequired(checked)}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
              />
            </Switch>
          </div>
        )}
        <button type="button" onClick={onDuplicate} className="flex items-center justify-start gap-2">
          <FiCopy size="18px" /> <span>Duplicar</span>
        </button>
        <button type="button" onClick={onDelete} className="flex items-center justify-start gap-2">
          <FiTrash size="18px" /> <span>Eliminar</span>
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 mt-8">
        <Button label="Cancelar" onclick={onCancel} type="button" buttonStyle="secondary" className="px-3 py-2 text-lg rounded-md" />
        <Button label="Guardar" type="submit" buttonStyle="primary" className="px-3 py-2 text-lg rounded-md" />
      </div>
    </>
  );
};
