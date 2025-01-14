'use client';

import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { toast } from 'react-toastify';

import Button from '@/src/components/form/Button';

import { useCourses } from '../hooks/useCourses';
import { useLessons } from '../hooks/useLessons';
import { useLessonPages } from '../hooks/useLessonPages';

export const DeleteContentModal = ({ content, isOpen, setIsOpen, onSuccess, contentType }) => {
  const [loading, setLoading] = useState(false);

  const { deleteCourse } = useCourses();
  const { deleteLesson } = useLessons();
  const { deletePage } = useLessonPages();

  const contentTypeLegend = {
    course: {
      name: 'Curso',
      method: deleteCourse,
    },
    lesson: {
      name: 'Carpeta',
      method: deleteLesson,
    },
    page: {
      name: 'Página',
      method: deletePage,
    },
  };

  const onCloseModal = () => {
    setIsOpen(false);
  };

  const onDelete = async () => {
    const contentHandler = contentTypeLegend[contentType];
    if (!contentHandler) return;

    setLoading(true);

    try {
      await contentHandler.method(content.id);
      // await deleteCourse(content.id);
      setIsOpen(false);

      if (onSuccess) onSuccess();

      toast.info(`Contenido eliminado`);
    } catch (error) {
      toast.error('Algo no ha salido bien. Por favor intente más tarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onCloseModal} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-2 ">
        <DialogPanel className="min-w-96 space-y-8  p-6 rounded-xl bg-gray-100">
          <DialogTitle className="font-bold">¿Está seguro de que desea eliminar el contenido{content ? ` ${content.name}` : ''}?</DialogTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Button label="Cancelar" type="button" buttonStyle="secondary" className="px-2 py-1 text-lg" onclick={onCloseModal} disabled={loading} />
            <Button label={loading ? 'Eliminando...' : 'Eliminar'} type="button" buttonStyle="error" className="px-2 py-1 text-lg" onclick={onDelete} disabled={loading} />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
