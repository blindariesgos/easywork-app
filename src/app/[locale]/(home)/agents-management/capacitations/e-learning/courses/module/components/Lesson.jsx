import React from 'react';

import { AccordionItem } from './AccordionItem';
import { LessonPage } from './LessonPage';

export const Lesson = ({ lesson, isOpen, onToggle, onEditLesson }) => {
  const editLesson = () => {};
  const addNewPage = () => {};
  const deleteLesson = () => {};

  return (
    <div>
      <AccordionItem title={lesson.name} isOpen={isOpen} onToggle={onToggle} itemType="lesson" actions={{ editLesson, addNewPage, deleteLesson }}>
        <LessonPage />
      </AccordionItem>
    </div>
  );
};
