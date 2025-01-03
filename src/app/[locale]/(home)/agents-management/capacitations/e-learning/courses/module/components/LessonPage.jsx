import React from 'react';
import AccordionItemMoreMenu from './LessonMoreMenu';
import DeleteContentModal from '../../../components/DeleteContentModal';
import { NewContentForm } from './NewContentForm';

export const LessonPage = ({ page, onSelectPage, editPage, duplicatePage, changeLesson, deletePage }) => {
  return (
    <div className="flex items-center justify-between cursor-pointer bg-[#eaeaea] px-2 py-1 rounded-xl mt-1.5" onClick={onSelectPage}>
      <p className="text-black">{page.name}</p>
      <AccordionItemMoreMenu itemType="page" actions={{ editPage, duplicatePage, changeLesson, deletePage }} />
    </div>
  );
};
