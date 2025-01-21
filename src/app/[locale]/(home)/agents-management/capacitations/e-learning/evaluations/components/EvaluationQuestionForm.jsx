import { Select, Input } from '@headlessui/react';
import { FiCopy } from 'react-icons/fi';

import Button from '@/src/components/form/Button';

import { EvaluationToolbar } from './EvaluationToolbar';

export const EvaluationQuestionForm = () => {
  return (
    <div className="bg-white px-4 py-6 rounded-lg">
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <Input className="rounded-lg w-full" placeholder="Pregunta..." />
        </div>

        <div>
          <Select id="course-page-options-evaluations" className="rounded-lg w-full">
            <option value="">
              <FiCopy size="18px" /> Selecciona una opción
            </option>
            <option value="">Opción múltiple</option>
            <option value="">Casilla de verificación</option>
            <option value="">Lista desplegable</option>
          </Select>
        </div>
      </div>

      <EvaluationToolbar />

      <Button label="Guardar" type="button" buttonStyle="primary" className="px-3 py-2 text-lg rounded-md ml-auto mt-4" />
    </div>
  );
};
