import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Switch } from '@headlessui/react';
import { CheckCircleIcon, PencilIcon } from '@heroicons/react/20/solid';

import Button from '@/src/components/form/Button';
import LessonTextEditor from './LessonTextEditor Beta';
import LessonTextEditorMoreMenu from './LessonTextEditorMoreMenu';

import NewLessonCoverPhoto from './NewLessonCoverPhoto';

import { createLesson, updateLesson } from '../services/create-lesson';

export const NewLessonForm = ({ course, lesson, onSuccess }) => {
  const isEdit = !!lesson;
  const [loading, setLoading] = useState(false);
  const [isEditorDisabled, setIsEditorDisabled] = useState(true);
  const [markAsDone, setMarkAsDone] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      name: 'Título de lección',
      description: '<p><span class="ql-size-large">Nueva página</span></p>',
      content: false,
      coverPhoto: null,
      courseId: course.id,
    },
  });

  const values = watch();

  const onSubmit = async values => {
    setLoading(true);

    try {
      const newLesson = new FormData();
      Object.entries(values).forEach(([key, value]) => newLesson.append(key, value));

      if (isEdit) {
        await updateLesson(lesson.id, newLesson);
      } else {
        await createLesson(newLesson);
      }

      reset();
      toast.success(isEdit ? 'Cambios guardados exitosamente!' : 'Lección creado exitosamente!');

      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Algo no ha salido muy bien. Por favor intente más tarde');
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (lesson)
  //     reset({
  //       name: lesson ? lesson.name : '',
  //       description: lesson ? lesson.description : '',
  //       content: lesson ? lesson.content : false,
  //       coverPhoto: lesson ? lesson.coverPhoto : null,
  //     });
  // }, [reset, lesson]);

  useEffect(() => {
    const toolbar = document.querySelector('.ql-toolbar');
    if (toolbar) {
      toolbar.style.backgroundColor = '#f5f5f5';
      // toolbar.style.borderTopLeftRadius = '0.75rem'; // Esquina superior izquierda redondeada
      // toolbar.style.borderTopRightRadius = '0.75rem'; // Esquina superior derecha redondeada
    }
  }, []);

  useEffect(() => {
    const toolbar = document.querySelector('.ql-toolbar');

    if (toolbar) {
      if (isEditorDisabled) {
        toolbar.style.display = 'none';
      } else {
        toolbar.style.display = 'block';
      }
    }
  }, [isEditorDisabled]);

  console.log(values.description);

  return (
    <form action={handleSubmit(onSubmit)}>
      <div className="p-5 flex items-center justify-between" style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
        <p className="text-lg font-bold">{values.name}</p>
        {/* {isEditorDisabled ? (
          <p className="text-lg font-bold">{values.name}</p>
        ) : (
          <div className="w-full">
            <input
              {...register('name', { required: 'El nombre es obligatorio.' })}
              type="text"
              autoComplete={false}
              className={`w-full block text-lg border-0 rounded-md focus:ring-0 ${errors.name ? 'focus:border-red-300 border-red-300' : ''}`}
              disabled={loading}
            />
            {errors.name && <p className="text-red-400 text-sm mt-1 pl-2">{errors.name.message}</p>}
          </div>
        )} */}

        <div className="flex items-center justify-center pr-2 gap-4">
          <button type="button" className="block cursor-pointer" onClick={() => setMarkAsDone(prev => !prev)}>
            <CheckCircleIcon className={`h-6 w-6 text-${markAsDone ? 'green' : 'gray'}-400`} aria-hidden="true" />
          </button>

          <button type="button" className="block bg-[#fafafa] hover:bg-[#f5f5f5] rounded-full p-1 cursor-pointer" onClick={() => setIsEditorDisabled(false)}>
            <PencilIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={isEditorDisabled ? 'flex items-center justify-center p-5' : ''}>
        <LessonTextEditor onChange={value => setValue('description', value)} value={values.description} disabled={isEditorDisabled} />

        {/* <div className="mb-4">
          <p className="text-gray-50 text-sm mb-1">Nombre</p>
          <input
            {...register('name', { required: 'El nombre es obligatorio.' })}
            type="text"
            placeholder="Módulo"
            className={`w-full resize-none outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none rounded-md placeholder:text-xs focus:ring-0 text-sm border  focus:ring-gray-200 focus:outline-0 ${errors.name ? 'focus:border-red-300 border-red-300' : 'border-gray-200'}`}
            disabled={loading}
          />
          {errors.name && <p className="text-red-400 text-sm mt-1 pl-2">{errors.name.message}</p>}
        </div>
        <div className="mb-4">
          <p className="text-gray-50 text-sm mb-1">Descripción</p>
          <TextEditor className="border rounded" onChange={value => setValue('description', value)} value={values.description} />
        </div>
        <div>
          <p className="text-gray-50 text-sm mb-1">Portada</p>
          <NewLessonCoverPhoto onChange={file => setValue('coverPhoto', file)} loading={loading} coverPhoto={values.coverPhoto} />
          {errors.coverPhoto && <p className="text-red-400 text-sm mt-1 pl-2">{errors.coverPhoto.message}</p>}
        </div> */}

        {!isEditorDisabled && (
          <div className="flex items-center sm:justify-center md:justify-between p-4 mt-4">
            <div>
              <LessonTextEditorMoreMenu />
            </div>
            <div className="flex items-center sm:justify-center md:justify-end gap-4">
              <div className="flex items-center justify-center gap-2">
                <p>Publicar</p>
                <Switch
                  disabled={loading}
                  // checked={isPublished}
                  // defaultChecked={isPublished}
                  // onChange={checked => setValue('isPublished', checked)}
                  className="group relative flex h-5 w-12 cursor-pointer rounded-full bg-gray-300 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-easy-300"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                  />
                </Switch>
              </div>
              <Button label="Cancelar" type="button" buttonStyle="secondary" className="px-4 py-2 text-lg" disabled={loading} onclick={() => setIsEditorDisabled(true)} />
              <Button label={loading ? 'Guardando...' : 'Guardar'} type="submit" buttonStyle="primary" className="px-4 py-2 text-lg" disabled={loading} />
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
