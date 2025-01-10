'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Switch } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import Button from '@/src/components/form/Button';

import NewCourseForm from './NewCourseForm';
import ModulePhoto from './ModulePhoto';

import { createCourse, updateCourse } from '../courses/services/create-course';

export default function CourseCreateEditModal({ course, isOpen, setIsOpen, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!course;

  // const schema = yup.object().shape({
  //   name: yup.string().required(t('common:validations:required')),
  //   description: yup.string(t('common:validations:required')),

  //   ot: yup.string().matches(VALIDATE_ALPHANUMERIC_REGEX, t('common:validations:alphanumeric')).required(t('common:validations:required')),
  //   sigre: yup.string().required(t('common:validations:required')),
  //   procedure: yup.string().required(t('common:validations:required')),
  // });

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
      coverPhoto: null,
    },
    // resolver: yupResolver(schema),
  });

  const { isPublished, coverPhoto, ...rest } = watch();

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
      reset();
      setIsOpen(false);
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
        coverPhoto: course ? course.coverPhotoSrc : null,
      });
  }, [course, reset]);

  return (
    <Dialog open={isOpen} onClose={onCloseModal} className="relative z-50">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-2 ">
        {/* The actual dialog panel  */}
        <DialogPanel className="min-w-96 space-y-8  p-6 rounded-xl bg-gray-100">
          <DialogTitle className="font-bold">Agregar curso</DialogTitle>

          <form action={handleSubmit(onSubmit)}>
            <NewCourseForm register={register} setValue={setValue} loading={loading} errors={errors} values={rest} />

            {/* Module Image */}
            <div className="px-4 w-full mb-4">
              <ModulePhoto onChange={file => setValue('coverPhoto', file)} loading={loading} coverPhoto={coverPhoto} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center justify-start gap-2">
                <p>Publicar</p>

                <Switch
                  disabled={loading}
                  checked={isPublished}
                  defaultChecked={isPublished}
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
}
