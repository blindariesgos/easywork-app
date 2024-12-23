import React from 'react';
import AccordionItemMoreMenu from './LessonMoreMenu';
import DeleteContentModal from '../../../components/DeleteContentModal';
import { NewContentForm } from './NewContentForm';

export const LessonPage = ({ page, onSelectPage, editPage, duplicatePage, changeLesson, deletePage }) => {
  return (
    <button className="relative block w-full text-left" type="button" onClick={onSelectPage}>
      <AccordionItemMoreMenu itemType="page" actions={{ editPage, duplicatePage, changeLesson, deletePage }} />

      <p className="bg-gray-600 text-black p-2 w-full rounded-md">{page.name}</p>
    </button>
  );
};
