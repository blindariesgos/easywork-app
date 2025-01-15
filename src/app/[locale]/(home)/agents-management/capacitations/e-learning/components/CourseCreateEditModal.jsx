'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Switch } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import Button from '@/src/components/form/Button';

import { CourseCover } from './CourseCover';

import { useCourses } from '../hooks/useCourses';

export const CourseCreateEditModal = ({ course, isOpen, setIsOpen, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { createCourse, updateCourse } = useCourses({ fetchOnMount: false });

  const isEdit = !!course;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      openToAll: false,
      private: false,
      openAfterNDays: false,
      isPublished: false,
      onlyDeleteImage: false,
      coverPhoto: null,
    },
  });

  const values = watch();

  const onCloseModal = () => {
    reset();
    setIsOpen(false);
  };

  const onSubmit = async values => {
    setLoading(true);

    try {
      const newCourse = new FormData();
      Object.entries(values).forEach(([key, value]) => newCourse.append(key, value));

      if (isEdit) {
        await updateCourse(course.id, newCourse);
      } else {
        await createCourse(newCourse);
      }

      setIsOpen(false);
      setValue('onlyDeleteImage', false);

      toast.success(isEdit ? 'Cambios guardados exitosamente!' : 'Curso creado exitosamente!');
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Algo no ha salido muy bien. Por favor intente más tarde');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (course)
      reset({
        name: course ? course.name : '',
        description: course ? course.description : '',
        openToAll: course ? course.openToAll : false,
        private: course ? course.private : false,
        openAfterNDays: course ? course.openAfterNDays : false,
        isPublished: course ? course.isPublished : false,
        onlyDeleteImage: false,
        coverPhoto: null,
      });
  }, [course, reset]);

  useEffect(() => {
    if (!isOpen)
      reset({
        name: '',
        description: '',
        openToAll: false,
        private: false,
        openAfterNDays: false,
        isPublished: false,
        onlyDeleteImage: false,
        coverPhoto: null,
      });
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onClose={onCloseModal} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-2 ">
        <DialogPanel className="min-w-96 space-y-8  p-6 rounded-xl bg-gray-100">
          <DialogTitle className="font-bold">Agregar curso</DialogTitle>

          <form action={handleSubmit(onSubmit)}>
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

            <div className="px-4 w-full mb-4">
              <CourseCover
                onChange={file => setValue('coverPhoto', file)}
                onDeleteImage={() => {
                  setValue('onlyDeleteImage', true);
                }}
                loading={loading}
                coverPhoto={values.coverPhoto || course?.coverPhotoSrc}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center justify-start gap-2">
                <p>Publicar</p>

                <Switch
                  disabled={loading}
                  checked={values.isPublished}
                  defaultChecked={values.isPublished}
                  onChange={checked => setValue('isPublished', checked)}
                  className="group relative flex h-5 w-12 cursor-pointer rounded-full bg-gray-300 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-easy-300"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                  />
                </Switch>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Button label="Cancelar" type="button" buttonStyle="secondary" className="px-2 py-1 text-lg" onclick={onCloseModal} disabled={loading} />
                <Button label={loading ? 'Guardando...' : 'Aceptar'} type="submit" buttonStyle="primary" className="px-2 py-1 text-lg" disabled={loading} />
              </div>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
