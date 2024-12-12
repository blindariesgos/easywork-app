import { useState } from 'react';

import Button from '@/src/components/form/Button';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Switch } from '@headlessui/react';

import NewCourseForm from './NewCourseForm';

export default function NewCourseModal({ isOpen, setIsOpen, handleClick, loading }) {
  const [enabled, setEnabled] = useState(false);

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-2 ">
        {/* The actual dialog panel  */}
        <DialogPanel className="min-w-96 space-y-8  p-6 rounded-xl bg-gray-100">
          <DialogTitle className="font-bold">Agregar curso</DialogTitle>

          <NewCourseForm />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center justify-start gap-2">
              <p>Publicar</p>

              <Switch
                checked={enabled}
                onChange={setEnabled}
                className="group relative flex h-5 w-12 cursor-pointer rounded-full bg-gray-300 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-easy-300"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                />
              </Switch>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button label="Cancelar" buttonStyle="secondary" className="px-2 py-1 text-lg" onclick={() => setIsOpen(false)} disabled={loading} />
              <Button label="Aceptar" buttonStyle="primary" className="px-2 py-1 text-lg" onclick={handleClick} disabled={loading} />
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
