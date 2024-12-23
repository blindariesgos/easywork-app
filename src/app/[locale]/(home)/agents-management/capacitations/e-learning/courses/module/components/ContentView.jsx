import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Switch } from '@headlessui/react';
import { CheckCircleIcon, PencilIcon } from '@heroicons/react/20/solid';

import Button from '@/src/components/form/Button';
import LessonTextEditor from './LessonTextEditor Beta';
import LessonTextEditorMoreMenu from './LessonTextEditorMoreMenu';

import NewLessonCoverPhoto from './NewLessonCoverPhoto';
import ContentViewCoverPhoto from './ContentViewCoverPhoto';

import { createLesson, updateLesson, getLesson } from '../services/lessons';
import { createPage, updatePage, getLessonPage } from '../services/lesson-pages';
import { LoadingSpinnerSmall } from '@/src/components/LoaderSpinner';

import '../styles/index.css';
import { FileUpload } from './FileUpload';

export const ContentView = ({ course, content, onSuccess, contentType, onCloseEditor }) => {
  const [loading, setLoading] = useState(false);
  const [isEditorDisabled, setIsEditorDisabled] = useState(true);
  const [markAsDone, setMarkAsDone] = useState(false);
  // const [contentDetails, setContentDetails] = useState(null);
  const inputFileRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      name: 'Título del contenido',
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
      if (contentType === 'lesson') {
        await updateLesson(content?.id, values);
      } else if (contentType === 'page') {
        await updatePage(content?.id, values);
      }

      // reset();
      toast.success('Cambios guardados exitosamente!');

      if (onSuccess) onSuccess();
    } catch (error) {
      console.log(error);
      toast.error('Algo no ha salido muy bien. Por favor intente más tarde');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (content)
      reset({
        name: content ? content.name : 'Título del contenido',
        description: content ? content.description : '<p><span class="ql-size-large">Nueva página</span></p>',
        content: content ? content.content : false,
        coverPhoto: content ? content.coverPhoto : null,
      });
  }, [content, reset]);

  useEffect(() => {
    const toolbar = document.querySelector('.ql-toolbar');
    if (toolbar) toolbar.style.display = isEditorDisabled ? 'none' : 'block';
  }, [isEditorDisabled]);

  return (
    <form action={handleSubmit(onSubmit)}>
      <div className="p-5 flex items-center justify-between bg-white rounded-xl mb-2" style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
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

      {content?.coverPhotoSrc && (
        <div className="bg-white rounded-xl mb-2">
          <ContentViewCoverPhoto coverPhoto={content?.coverPhotoSrc} />
        </div>
      )}

      <div className={`${isEditorDisabled ? 'flex items-center justify-center p-5' : ''} bg-white rounded-xl mb-2`}>
        {loading && (
          <div className="h-48 w-full">
            <LoadingSpinnerSmall />
          </div>
        )}

        {!loading && <LessonTextEditor onChange={value => setValue('description', value)} value={values.description} disabled={isEditorDisabled} />}

        {!isEditorDisabled && !loading && (
          <div className="flex items-center sm:justify-center md:justify-between p-4 mt-4">
            <div>
              <LessonTextEditorMoreMenu
                onAttachFile={() => {
                  inputFileRef.current?.click();
                }}
              />
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

      <div className="bg-white rounded-xl flex gap-1">
        <FileUpload inputRef={inputFileRef} />
      </div>
    </form>
  );
};
