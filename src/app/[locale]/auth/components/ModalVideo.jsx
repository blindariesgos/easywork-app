import React, { useState, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';

export default function ModalVideo({ buttonOpen }) {
  const [isOpen, setIsOpen] = useState(false);

  const ButtonOpen = React.cloneElement(buttonOpen, {
    onClick: () => setIsOpen(true),
  });

  return (
    <div className="flex items-center justify-center">
      {ButtonOpen}

      <Transition show={isOpen} as={Fragment}>
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50 -z-1"></div>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className='relative w-3/4 h-3/4 '>
              <div className="max-w-6xl h-full max-h-screen p-6 mx-auto bg-easywork-main rounded shadow-lg z-50 overflow-auto">
                <div className="video-responsive h-full">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="absolute -left-1 -top-3 p-1 mt-4 text-white bg-easywork-main rounded"
                >
                  <XMarkIcon className="h-5 w-5 text-slate-50" />
                </button>
            </div>
          </Transition.Child>
        </div>
      </Transition>
    </div>
  );
}
