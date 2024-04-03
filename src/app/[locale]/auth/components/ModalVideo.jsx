import React, { useState, Fragment  } from 'react';
import { Transition } from '@headlessui/react';

export default function ModalVideo({buttonOpen}) {
    const [isOpen, setIsOpen] = useState(false);
  
    const ButtonOpen = React.cloneElement(buttonOpen, {
      onClick: () => setIsOpen(true),
    });
  
    return (
      <div className="flex items-center justify-center">
        {ButtonOpen}

      <Transition show={isOpen} as={Fragment}>
        <div className="fixed inset-0 flex items-center justify-center z-50">

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="w-full max-w-md p-6 mx-auto bg-white rounded shadow-lg">
              <h2 className="text-2xl">Modal Title</h2>
              <p className="mt-4">Modal Content</p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 mt-4 text-white bg-blue-500 rounded"
              >
                Cerrar Modal
              </button>
            </div>
          </Transition.Child>
        </div>
      </Transition>
    </div>
  );
}
