'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { toast } from 'react-toastify';

import Button from '@/src/components/form/Button';

import { createLesson, updateLesson } from '../services/lessons';
import { createPage, updatePage } from '../services/lesson-pages';

export const NewContentForm = ({ content, isOpen, setIsOpen, contentType = '', parent, onSuccess }) => {
  const isEdit = !!content;
  const [loading, setLoading] = useState(false);
  // const [contentName, setContentName] = useState(content?.name || '');
  const contentNameInputRef = useRef(null);

  const onCloseModal = () => {
    setIsOpen(false);
  };

  const onSave = async () => {
    setLoading(true);

    try {
      const newName = contentNameInputRef.current.value;
      if (!newName) return;

      if (contentType === 'lesson') {
        if (isEdit) {
          await updateLesson(content.id, { name: newName });
        } else {
          await createLesson({ name: newName, courseId: parent.id });
        }
      } else if (contentType === 'page') {
        if (isEdit) {
          await updatePage(content.id, { name: newName });
        } else {
          await createPage({ name: newName, lessonId: parent.id });
        }
      }

      if (onSuccess) onSuccess();

      toast.success('Contenido guardado correctamente');
    } catch (error) {
      toast.error('Algo no ha salido muy bien. Por favor intente más tarde');
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onCloseModal} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-2 ">
        <DialogPanel className="min-w-96 space-y-8  p-6 rounded-xl bg-gray-100">
          <DialogTitle className="font-bold">{isEdit ? 'Editar' : 'Agregar'} contenido</DialogTitle>

          <input
            ref={contentNameInputRef}
            id="contentName"
            name="contentName"
            type="text"
            placeholder="Ej: Capítulo 1"
            className={`w-full resize-none outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none rounded-md placeholder:text-xs focus:ring-0 text-sm border  focus:ring-gray-200 focus:outline-0`}
            disabled={loading}
            defaultValue={content?.name || ''}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Button label="Cancelar" type="button" buttonStyle="secondary" className="px-2 py-1 text-lg" onclick={onCloseModal} disabled={loading} />
            <Button label={loading ? 'Guardando...' : 'Guardar'} type="button" buttonStyle="primary" className="px-2 py-1 text-lg" onclick={onSave} disabled={loading} />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
