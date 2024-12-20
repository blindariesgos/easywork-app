'use client';

import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { toast } from 'react-toastify';

import Button from '@/src/components/form/Button';

import { deleteCourse } from '../courses/services/create-course';

export default function DeleteCourseModal({ course, isOpen, setIsOpen }) {
  const [loading, setLoading] = useState(false);

  const onCloseModal = () => {
    setIsOpen(false);
  };

  const onDelete = async () => {
    setLoading(true);

    try {
      await deleteCourse(course.id);
      setIsOpen(false);
      toast.info('Curso eliminado');
    } catch (error) {
      toast.error('Algo no ha salido muy bien. Por favor intente más tarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onCloseModal} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-2 ">
        <DialogPanel className="min-w-96 space-y-8  p-6 rounded-xl bg-gray-100">
          <DialogTitle className="font-bold">¿Está seguro de que desea eliminar el curso{course ? ` ${course.name}` : ''}?</DialogTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Button label="Cancelar" type="button" buttonStyle="secondary" className="px-2 py-1 text-lg" onclick={onCloseModal} disabled={loading} />
            <Button label={loading ? 'Eliminando...' : 'Eliminar'} type="button" buttonStyle="error" className="px-2 py-1 text-lg" onclick={onDelete} disabled={loading} />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
