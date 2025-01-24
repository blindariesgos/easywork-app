'use client';

import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { toast } from 'react-toastify';
import { Select } from '@headlessui/react';

import Button from '@/src/components/form/Button';

import { useCourseFolderPages } from '../../hooks/useCourseFolderPages';

export const ChangeFolderForm = ({ page, currentFolder, isOpen, folders, setIsOpen, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [folderId, setFolderId] = useState(currentFolder?.id || '');

  const { changeFolderPage } = useCourseFolderPages();

  const onCloseModal = () => {
    setIsOpen(false);
    setFolderId('');
  };

  const onSave = async () => {
    if (!page) return;

    setLoading(true);

    try {
      await changeFolderPage(page.id, { folderId: folderId });

      if (onSuccess) onSuccess();
      toast.success('Cambio de carpeta efectuado correctamente');
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
        <DialogPanel className="w-96 space-y-6 p-6 rounded-xl bg-gray-100">
          <DialogTitle className="font-bold">Cambiar de carpeta</DialogTitle>

          <div>
            <p>
              <span className="font-bold text-sm">Página:</span> {page?.name}
            </p>

            <p className="mt-4 text-sm">Carpeta actual:</p>
            <div className="border rounded-lg bg-[#f5f5f5] p-2 mt-1">
              <p>{currentFolder?.name}</p>
            </div>

            <p className="mt-4 text-sm">Mover a:</p>

            <Select id="course-page-options-evaluations" className="rounded-lg w-full mt-1" value={folderId} onChange={e => setFolderId(e.target.value)}>
              <option value="">Selecciona una opción</option>
              {folders
                .filter(folder => folder.id !== currentFolder?.id)
                .map(folder => (
                  <option value={folder.id} key={folder.id}>
                    {folder.name}
                  </option>
                ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Button label="Cancelar" type="button" buttonStyle="secondary" className="px-2 py-1 text-lg" onclick={onCloseModal} disabled={loading} />
            <Button label={loading ? 'Guardando...' : 'Guardar'} type="button" buttonStyle="primary" className="px-2 py-1 text-lg" onclick={onSave} disabled={loading} />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
