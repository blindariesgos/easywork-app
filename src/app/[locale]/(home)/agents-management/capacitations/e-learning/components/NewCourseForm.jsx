import React from 'react';

export default function NewCourseForm({ register, setValue, loading, errors, values, openAfterNDays, openToAll }) {
  return (
    <div className="w-full">
      <div>
        <input
          {...register('name', { required: 'El nombre es obligatorio.' })}
          type="text"
          placeholder="Módulo"
          className={`w-full resize-none outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none rounded-md placeholder:text-xs focus:ring-0 text-sm border  focus:ring-gray-200 focus:outline-0 ${errors.name ? 'focus:border-red-300 border-red-300' : 'border-gray-200'}`}
          disabled={loading}
        />
        {errors.name && <p className="text-red-400 text-sm mt-1 pl-2">{errors.name.message}</p>}
      </div>
      <div className="w-full mt-4">
        <textarea
          {...register('description')}
          placeholder="Descripción"
          rows={5}
          className="w-full resize-none outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none rounded-md placeholder:text-xs focus:ring-0 text-sm border border-gray-200 focus:ring-gray-200 focus:outline-0"
          disabled={loading}
        />
      </div>
      <div className="w-full mt-4 bg-white rounded flex justify-between items-center gap-10 p-4">
        <div>
          <input
            type="checkbox"
            className="mr-1 h-4 w-4 border-gray-300 text-primary focus:ring-primary"
            onChange={e => setValue('openToAll', e.target.checked)}
            disabled={loading}
            defaultChecked={values.openToAll}
          />
          Abierto para todos
        </div>
        <div>
          <input
            type="checkbox"
            className="mr-1 h-4 w-4 border-gray-300 text-primary focus:ring-primary"
            onChange={e => setValue('private', e.target.checked)}
            disabled={loading}
            defaultChecked={values.private}
          />
          Privado
        </div>
        <div>
          <input
            type="checkbox"
            className="mr-1 h-4 w-4 border-gray-300 text-primary focus:ring-primary"
            onChange={e => setValue('openAfterNDays', e.target.checked)}
            disabled={loading}
            defaultChecked={values.openAfterNDays}
          />
          Desbloquear después de x días
        </div>
      </div>
    </div>
  );
}
