import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { DeleteContentModal } from '../../components/DeleteContentModal';

import { AccordionItem } from './AccordionItem';
import { CourseFolderPage } from './CourseFolderPage';
import { NewPageButton } from './NewPageButton';
import { NewContentForm } from './NewContentForm';

import { useCourseFolderPages } from '../../hooks/useCourseFolderPages';
import { useCourseFolders } from '../../hooks/useCourseFolders';

export const CourseFolder = ({ courseFolder, isOpen, onToggle, onSelectPage, refetchAccordionItems }) => {
  const { getCourseFolder } = useCourseFolders();
  const { duplicateCourseFolderPage } = useCourseFolderPages();

  const [courseFolderDetails, setCourseFolderDetail] = useState(courseFolder);
  const [courseFolderPages, setCourseFolderPages] = useState(courseFolder?.pages || []);
  const [isNewContentFormOpen, setIsNewContentFormOpen] = useState(false);
  const [isDeleteContentModalOpen, setIsDeleteModalContentOpen] = useState(false);
  const contentToHandle = useRef({ content: null, type: '' });
  const countCourseFolderPages = courseFolderPages?.length || 0;

  const editCourseFolder = () => {
    contentToHandle.current.type = 'folder';
    contentToHandle.current.content = courseFolder;
    setIsNewContentFormOpen(true);
  };

  const deleteCourseFolder = () => {
    contentToHandle.current.type = 'folder';
    contentToHandle.current.content = courseFolder;
    setIsDeleteModalContentOpen(true);
  };

  const fetchCourseFolderDetails = async () => {
    const result = await getCourseFolder(courseFolder.id);
    setCourseFolderDetail(result);
    setCourseFolderPages(result.pages);
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
    await duplicateCourseFolderPage(page.id);
    fetchCourseFolderDetails();
  };

  const changeCourseFolder = () => {
    toast.info('En construcción 🚧');
  };

  const deletePage = page => {
    contentToHandle.current.type = 'page';
    contentToHandle.current.content = page;
    setIsDeleteModalContentOpen(true);
  };

  const refetch = () => {
    if (contentToHandle.current.type === 'page') {
      fetchCourseFolderDetails();
    } else {
      refetchAccordionItems();
    }
  };

  return (
    <div className="mt-1.5">
      <AccordionItem
        title={courseFolderDetails.name}
        isOpen={isOpen}
        onToggle={() => {
          onToggle();
        }}
        // onSelect={() => onSelectCourseFolder(courseFolder)}
        itemType="folder"
        actions={{ editCourseFolder, addNewPage, deleteCourseFolder }}
        isCompleted={courseFolder.isCompleted}
      >
        {courseFolderPages?.length > 0 &&
          courseFolderPages.map((page, i) => {
            const isFirstElement = i === 0;
            const isLastElement = i === countCourseFolderPages - 1;

            return (
              <div key={page.id} className={`${isFirstElement || isLastElement ? '' : 'my-1'}`}>
                <CourseFolderPage
                  page={page}
                  onSelectPage={() => onSelectPage(page, i)}
                  editPage={() => editPage(page)}
                  duplicatePage={() => duplicatePage(page)}
                  changeCourseFolder={changeCourseFolder}
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
        parent={courseFolder}
        onSuccess={fetchCourseFolderDetails}
      />
    </div>
  );
};