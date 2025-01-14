import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { DeleteContentModal } from '../../components/DeleteContentModal';

import { AccordionItem } from './AccordionItem';
import { LessonPage } from './LessonPage';
import { NewPageButton } from './NewPageButton';
import { NewContentForm } from './NewContentForm';

import { useLessonPages } from '../../hooks/useLessonPages';
import { useLessons } from '../../hooks/useLessons';

export const Lesson = ({ lesson, isOpen, onToggle, onSelectLesson, onSelectPage, refetchContentDetails }) => {
  const { getLesson } = useLessons();
  const { duplicatePage: duplicateLessonPage } = useLessonPages();

  const [lessonDetails, setLessonDetail] = useState(lesson);
  const [lessonPages, setLessonPages] = useState(lesson?.pages || []);
  const [isNewContentFormOpen, setIsNewContentFormOpen] = useState(false);
  const [isDeleteContentModalOpen, setIsDeleteModalContentOpen] = useState(false);
  const contentToHandle = useRef({ content: null, type: '' });
  const countLessonPages = lessonPages?.length || 0;

  // Lessons
  const editLesson = () => {
    contentToHandle.current.type = 'lesson';
    contentToHandle.current.content = lesson;
    setIsNewContentFormOpen(true);
  };

  const deleteLesson = () => {
    contentToHandle.current.type = 'lesson';
    contentToHandle.current.content = lesson;
    setIsDeleteModalContentOpen(true);
  };

  const fetchLessonDetails = async () => {
    const result = await getLesson(lesson.id);
    setLessonDetail(result);
    setLessonPages(result.pages);
  };

  // Pages
  const addNewPage = () => {
    contentToHandle.current.type = 'page';
    contentToHandle.current.content = null;
    setIsNewContentFormOpen(true);
  };

  const editPage = page => {
    contentToHandle.current.type = 'page';
    contentToHandle.current.content = page;
    setIsNewContentFormOpen(true);
  };

  const duplicatePage = async page => {
    await duplicateLessonPage(page.id);
    fetchLessonDetails();
  };

  const changeLesson = () => {
    toast.info('En construcción 🚧');
  };

  const deletePage = page => {
    contentToHandle.current.type = 'page';
    contentToHandle.current.content = page;
    setIsDeleteModalContentOpen(true);
  };

  const refetch = () => {
    if (contentToHandle.current.type === 'page') {
      fetchLessonDetails();
    } else {
      refetchContentDetails();
    }
  };

  return (
    <div className="mt-1.5">
      <AccordionItem
        title={lessonDetails.name}
        isOpen={isOpen}
        onToggle={() => {
          onToggle();
        }}
        onSelect={() => onSelectLesson(lesson)}
        itemType="lesson"
        actions={{ editLesson, addNewPage, deleteLesson }}
        isCompleted={lesson.isCompleted}
      >
        {lessonPages?.length > 0 &&
          lessonPages.map((page, i) => {
            const isFirstElement = i === 0;
            const isLastElement = i === countLessonPages - 1;

            return (
              <div key={page.id} className={`${isFirstElement || isLastElement ? '' : 'my-1'}`}>
                <LessonPage
                  page={page}
                  onSelectPage={() => onSelectPage(page, i)}
                  editPage={() => editPage(page)}
                  duplicatePage={() => duplicatePage(page)}
                  changeLesson={changeLesson}
                  deletePage={() => deletePage(page)}
                  isCompleted={page.isCompleted}
                />
              </div>
            );
          })}

        <NewPageButton onClick={addNewPage} />
      </AccordionItem>

      <DeleteContentModal
        isOpen={isDeleteContentModalOpen}
        setIsOpen={setIsDeleteModalContentOpen}
        content={contentToHandle.current.content}
        contentType={contentToHandle.current.type}
        onSuccess={refetch}
      />
      <NewContentForm
        isOpen={isNewContentFormOpen}
        setIsOpen={setIsNewContentFormOpen}
        content={contentToHandle.current.content}
        contentType={contentToHandle.current.type}
        parent={lesson}
        onSuccess={fetchLessonDetails}
      />
    </div>
  );
};
