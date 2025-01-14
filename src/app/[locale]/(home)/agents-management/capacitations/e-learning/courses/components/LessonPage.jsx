import React from 'react';
import { AccordionItemMoreMenu } from './AccordionItemMoreMenu';
import { CheckCircleIcon } from '@heroicons/react/20/solid';

export const LessonPage = ({ page, onSelectPage, editPage, duplicatePage, changeLesson, deletePage, isCompleted }) => {
  return (
    <div className="flex items-center justify-between cursor-pointer bg-[#eaeaea] px-2 py-1 rounded-xl mt-1.5" onClick={onSelectPage}>
      <p className="text-black">{page.name}</p>
      <div className="flex items-center justify-center gap-2">
        {isCompleted && <CheckCircleIcon className="w-6 text-green-400" aria-hidden="true" />}
        <AccordionItemMoreMenu itemType="page" actions={{ editPage, duplicatePage, changeLesson, deletePage }} />
      </div>
    </div>
  );
};
