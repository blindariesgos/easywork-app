import React from 'react';

import { AccordionItem } from './AccordionItem';
import { LessonPage } from './LessonPage';
import { NewPageButton } from './NewPageButton';

export const Lesson = ({ lesson, isOpen, onToggle, onEditLesson }) => {
  const editLesson = () => {};
  const addNewPage = () => {};
  const deleteLesson = () => {};

  return (
    <div>
      <AccordionItem title={lesson.name} isOpen={isOpen} onToggle={onToggle} itemType="lesson" actions={{ editLesson, addNewPage, deleteLesson }}>
        {lesson.pages.length > 0 ? lesson.pages.map(page => <LessonPage key={page.id} page={page} />) : <NewPageButton onClick={addNewPage} />}
      </AccordionItem>
    </div>
  );
};
