'use client';

import NewModuleCard from '../components/NewModuleCard';
import NewCourseModal from '../components/NewCourseModal';
import { useState } from 'react';

export default function ConfigView() {
  const [isNewCourseModalOpen, setIsNewCourseModalOpen] = useState(false);

  return (
    <>
      <NewModuleCard onClick={() => setIsNewCourseModalOpen(true)} />
      <NewCourseModal isOpen={isNewCourseModalOpen} setIsOpen={setIsNewCourseModalOpen} />
    </>
  );
}
