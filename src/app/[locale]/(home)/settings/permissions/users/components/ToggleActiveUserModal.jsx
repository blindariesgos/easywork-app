'use client';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

import Button from '@/src/components/form/Button';

export const ToggleActiveUserModal = ({ isOpen, setIsOpen, onClose, isActive, onSuccess }) => {
  const onCloseModal = () => {
    if (onClose) onClose();

    setIsOpen(false);
  };

  const onConfirm = () => {
    if (onSuccess) onSuccess();
    onCloseModal();
  };

  return (
    <Dialog open={isOpen} onClose={onCloseModal} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-2 ">
        <DialogPanel className="w-96 space-y-8  p-6 rounded-xl bg-gray-100">
          <DialogTitle className="font-bold">¿{isActive ? 'Desactivar' : 'Activar'} el usuario?</DialogTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Button label="Cancelar" type="button" buttonStyle="secondary" className="px-2 py-1 text-lg" onclick={onCloseModal} />
            <Button label="Confirmar" type="button" buttonStyle="primary" className="px-2 py-1 text-lg" onclick={onConfirm} />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
