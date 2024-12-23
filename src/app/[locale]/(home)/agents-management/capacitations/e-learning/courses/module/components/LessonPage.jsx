import React from 'react';
import AccordionItemMoreMenu from './LessonMoreMenu';
import DeleteContentModal from '../../../components/DeleteContentModal';
import { NewContentForm } from './NewContentForm';

export const LessonPage = ({ page, editPage, duplicatePage, changeLesson, deletePage }) => {
  return (
    <>
      <div className="relative">
        <AccordionItemMoreMenu itemType="page" actions={{ editPage, duplicatePage, changeLesson, deletePage }} />

        <p className="bg-gray-600 text-black p-2 w-full rounded-md">{page.name}</p>
      </div>

      {/* <DeleteContentModal isOpen={isDeleteContentModalOpen} setIsOpen={setIsDeleteModalCourseOpen} content={lesson} contentType="lesson" onSuccess={fetchLessonDetails} />
      
      <NewContentForm isOpen={isNewContentFormOpen} setIsOpen={setIsNewContentFormOpen} content={page} contentType='page' onSuccess={fetchLessonDetails} /> */}
    </>
  );
};
