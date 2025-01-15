import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Switch } from '@headlessui/react';
import { CheckCircleIcon, PencilIcon } from '@heroicons/react/20/solid';
import { FaSave } from 'react-icons/fa';

import { useDebouncedCallback } from 'use-debounce';
import { useLessonPages } from '../../hooks/useLessonPages';
import { useLessons } from '../../hooks/useLessons';
import { useUserPermissions } from '../../../hooks/useUserPermissions';

import Button from '@/src/components/form/Button';

import ContentViewTextEditor from './ContentViewTextEditor';
import { ContentViewAttach } from './ContentViewAttach';
import { ContentViewCoverPhoto } from './ContentViewCoverPhoto';
import { LoadingSpinnerSmall } from '@/src/components/LoaderSpinner';
import { FileUpload } from './FileUpload';

import '../styles/index.css';
import { LMS_PERMISSIONS } from '../../../constants';

export const ContentView = ({ course, content, onSuccess, contentType, refetchAccordionItems }) => {
  const isEdit = !!content;

  const [loading, setLoading] = useState(false);
  const [isEditorDisabled, setIsEditorDisabled] = useState(true);
  const [markAsDone, setMarkAsDone] = useState(content?.isCompleted || false);
  const inputFileRef = useRef(null);

  const { hasPermission } = useUserPermissions();
  const { createLesson, toggleLessonAsCompleted, updateLesson } = useLessons();
  const { toggleLessonPageAsCompleted, updatePage } = useLessonPages();

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
      files: [],
      filesToDelete: [],
      imagesToDelete: [],
    },
  });

  const values = watch();

  const onDeleteImage = async images => {
    setValue('imagesToDelete', [...values.imagesToDelete, ...images]);
  };

  const prepareValues = values => {
    const newValues = new FormData();
    const { files, filesToDelete, imagesToDelete, ...rest } = values;

    Object.entries(rest).forEach(([key, value]) => {
      newValues.append(key, value);
    });

    if (files.length > 0)
      files.forEach(file => {
        newValues.append('files', file);
      });

    if (filesToDelete.length > 0) newValues.append('filesToDelete', JSON.stringify(filesToDelete));
    if (imagesToDelete.length > 0) newValues.append('imagesToDelete', JSON.stringify(imagesToDelete));

    return newValues;
  };

  const saveChanges = async values => {
    const newValues = prepareValues(values);

    if (isEdit) {
      if (contentType === 'lesson') {
        await updateLesson(content?.id, newValues);
      } else if (contentType === 'page') {
        await updatePage(content?.id, newValues);
      }
    } else {
      await createLesson(newValues);
    }

    setValue('files', []);
    setValue('filesToDelete', []);
    setValue('imagesToDelete', []);
  };

  const saveContentOnChange = useDebouncedCallback(() => {
    saveChanges(values);
  }, 500);

  const onSubmit = async values => {
    setLoading(true);

    try {
      await saveChanges(values);

      // setValue('files', []);
      // setValue('filesToDelete', []);
      // setValue('imagesToDelete', []);

      toast.success('Cambios guardados exitosamente!');

      if (onSuccess) onSuccess();

      setIsEditorDisabled(true);
    } catch (error) {
      console.log(error);
      toast.error('Algo no ha salido muy bien. Por favor intente más tarde');
    } finally {
      setLoading(false);
    }
  };

  const toggleIsCompleted = async () => {
    if (!hasPermission(LMS_PERMISSIONS.markAsCompleted)) return;

    const toggled = !markAsDone;

    setMarkAsDone(prev => !prev);

    try {
      if (contentType === 'lesson') {
        await toggleLessonAsCompleted(content.id, toggled);
      } else {
        await toggleLessonPageAsCompleted(content.id, toggled);
      }

      if (refetchAccordionItems) refetchAccordionItems();

      toast.info(`Contenido marcado como ${toggled ? 'completado' : 'no completado'}`);
    } catch (error) {
      toast.info(`Estamos teniendo problemas para guardar los cambios. Intenta más tarde`);
    }
  };

  useEffect(() => {
    if (content) {
      reset({
        name: content ? content.name : 'Título del contenido',
        description: content && content.description !== '<p><br></p>' ? content.description : '<p><span class="ql-size-large">Nueva página</span></p>',
        content: content ? content.content : false,
        coverPhoto: content ? content.coverPhoto : null,
        files: [],
        filesToDelete: [],
        imagesToDelete: [],
      });
    }
  }, [content, reset]);

  useEffect(() => {
    const toolbar = document.querySelector('.ql-toolbar');
    if (toolbar) toolbar.style.display = isEditorDisabled ? 'none' : 'block';
  }, [isEditorDisabled]);

  // useEffect(() => {
  //   saveContentOnChange(values);
  // }, [saveContentOnChange, values]);

  return (
    <form action={handleSubmit(onSubmit)}>
      <div className="p-5 flex items-center justify-between bg-white rounded-xl mb-2" style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
        {isEditorDisabled && hasPermission(LMS_PERMISSIONS.editContentTitle) ? (
          <p className="text-lg font-bold">{values.name}</p>
        ) : (
          <div className="w-full">
            <input
              {...register('name', { required: 'El nombre es obligatorio.' })}
              type="text"
              className={`w-full block text-lg border-0 rounded-md focus:ring-0 ${errors.name ? 'focus:border-red-300 border-red-300' : ''}`}
              disabled={loading}
            />
            {errors.name && <p className="text-red-400 text-sm mt-1 pl-2">{errors.name.message}</p>}
          </div>
        )}

        <div className="flex items-center justify-center pr-2 gap-4">
          {isEditorDisabled ? (
            <>
              {hasPermission(LMS_PERMISSIONS.markAsCompleted) && (
                <button type="button" className="block cursor-pointer" onClick={toggleIsCompleted}>
                  <CheckCircleIcon className={`h-6 w-6 text-${markAsDone ? 'green' : 'gray'}-400`} aria-hidden="true" />
                </button>
              )}

              <button type="button" className="block bg-[#fafafa] hover:bg-[#f5f5f5] rounded-full p-1 cursor-pointer" onClick={() => setIsEditorDisabled(false)}>
                <PencilIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </button>
            </>
          ) : (
            <button type="submit" className="block cursor-pointer" disabled={loading}>
              {loading ? <LoadingSpinnerSmall /> : <FaSave className={`h-6 w-6 text-${markAsDone ? 'green' : 'gray'}-400`} aria-hidden="true" />}
            </button>
          )}
        </div>
      </div>

      {content?.coverPhotoSrc && (
        <div className="bg-white rounded-xl mb-2">
          <ContentViewCoverPhoto coverPhoto={content?.coverPhotoSrc} />
        </div>
      )}

      <div className={`${isEditorDisabled ? 'px-2 pt-2 pb-5' : ''} bg-white rounded-xl mb-2`}>
        {loading && (
          <div className="h-48 w-full">
            <LoadingSpinnerSmall />
          </div>
        )}

        {!loading && (
          <ContentViewTextEditor
            onChange={value => {
              setValue('description', value);
              saveContentOnChange();
            }}
            value={values.description}
            disabled={isEditorDisabled || hasPermission(LMS_PERMISSIONS.editContentBody)}
            onDeleteImage={onDeleteImage}
          />
        )}

        <div className="mt-4">
          <FileUpload
            inputRef={inputFileRef}
            onChange={files => {
              setValue('files', files);
              saveContentOnChange();
            }}
            onDelete={file => {
              setValue('filesToDelete', [...values.filesToDelete, file.url]);
            }}
            files={content?.files || []}
            disabled={isEditorDisabled}
            loading={loading}
          />
        </div>

        {!isEditorDisabled && !loading && (
          <div className="flex items-center sm:justify-center md:justify-between p-4 mt-4">
            <div>
              <ContentViewAttach
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
    </form>
  );
};
