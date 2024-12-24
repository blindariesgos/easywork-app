'use client';

import { useState } from 'react';
import CourseCreateEditModal from '../components/CourseCreateEditModal';

export default function ConfigView() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-gray-200 rounded-xl hover:shadow-lg transition-shadow cursor-pointer w-80 h-96 flex items-center justify-center">
        <p className="font-bold text-gray-400">+ Nuevo curso</p>
      </button>

      <CourseCreateEditModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
