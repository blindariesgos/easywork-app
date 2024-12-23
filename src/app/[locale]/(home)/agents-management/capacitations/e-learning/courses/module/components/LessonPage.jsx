import React from 'react';
import AccordionItemMoreMenu from './LessonMoreMenu';

export const LessonPage = ({ page }) => {
  const editPage = () => {};
  const duplicatePage = () => {};
  const changeLesson = () => {};
  const deletePage = () => {};

  return (
    <div className="relative">
      <AccordionItemMoreMenu itemType="page" actions={{ editPage, duplicatePage, changeLesson, deletePage }} />

      <p className="bg-gray-600 text-black p-2 w-full rounded-md">{page.name}</p>
    </div>
  );
};
