import { Select } from '@headlessui/react';

export const EvaluationHeader = () => {
  return (
    <div className="w-full">
      <h2 className="font-bold mb-2">Vincular evaluación a:</h2>

      <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <p>Curso</p>

          <Select
            id="course-options-evaluations"
            className="rounded-lg w-full"
            // onChange={e => setInvite(e.target.value)} // Maneja el evento onChange
            // value={invite} // Asigna el valor actual del estado
          >
            <option value="1">Selecciona una opción</option>
          </Select>
        </div>

        <div>
          <p>Página</p>
          <Select
            id="course-page-options-evaluations"
            className="rounded-lg w-full"
            // onChange={e => setInvite(e.target.value)} // Maneja el evento onChange
            // value={invite} // Asigna el valor actual del estado
          >
            <option value="1">Selecciona una opción</option>
          </Select>
        </div>
      </div>
    </div>
  );
};
