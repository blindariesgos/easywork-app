import React from 'react';
import TextInput from '../../../../../../../components/form/TextInput';
import ModulePhoto from './ModulePhoto';

export default function NewCourseForm() {
  return (
    <div className="w-full">
      <div>
        <TextInput placeholder="Módulo" onChangeCustom={e => setQuery(e.target.value)} border />
      </div>
      <div className="w-full mt-4">
        <TextInput placeholder="Descripción" onChangeCustom={e => setQuery(e.target.value)} border multiple />
      </div>
      <div className="w-full mt-4 bg-white rounded flex justify-between items-center gap-10 p-4">
        <div>
          <input type="checkbox" className="mr-1 h-4 w-4 border-gray-300 text-primary focus:ring-primary" />
          Abierto para todos
        </div>
        <div>
          <input type="checkbox" className="mr-1 h-4 w-4 border-gray-300 text-primary focus:ring-primary" />
          Privado
        </div>
        <div>
          <input type="checkbox" className="mr-1 h-4 w-4 border-gray-300 text-primary focus:ring-primary" />
          Desbloquear después de x días
        </div>
      </div>

      {/* Module Image */}
      <div className="px-4">
        <ModulePhoto />
      </div>
    </div>
  );
}
