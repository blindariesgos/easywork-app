import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { DeleteContentModal } from '../../components/DeleteContentModal';

import { AccordionItem } from './AccordionItem';
import { CourseFolderPage } from './CourseFolderPage';
import { NewPageButton } from './NewPageButton';
import { NewContentForm } from './NewContentForm';
import { ChangeFolderForm } from './ChangeFolderForm';
import { AssignPageModal } from '../../components/AssignPageModal';

import { useCourseFolderPages } from '../../hooks/useCourseFolderPages';
import { useCourseFolders } from '../../hooks/useCourseFolders';
import { LMS_PERMISSIONS } from '../../../constants';
import { useUserPermissions } from '../../../hooks/useUserPermissions';

export const CourseFolder = ({ course, courseFolder, contentSelected, isOpen, onToggle, onSelectPage, refetchAccordionItems, folders }) => {
  const { getCourseFolder } = useCourseFolders();
  const { duplicateCourseFolderPage } = useCourseFolderPages();
  const { hasPermission } = useUserPermissions();
  const { data: session } = useSession();
  const router = useRouter();

  const [courseFolderDetails, setCourseFolderDetail] = useState(courseFolder);
  const [courseFolderPages, setCourseFolderPages] = useState([]);
  const [isNewContentFormOpen, setIsNewContentFormOpen] = useState(false);
  const [isDeleteContentModalOpen, setIsDeleteModalContentOpen] = useState(false);
  const [isChangeFolderModalOpen, setIsChangeFolderModalOpen] = useState(false);
  const [isAssignPageModalOpen, setIsAssignPageModalOpen] = useState(false);
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

  const changeCourseFolder = (page, folder) => {
    contentToHandle.current.type = 'change-folder';
    contentToHandle.current.content = { page, folder };
    setIsChangeFolderModalOpen(true);
  };

  const deletePage = page => {
    contentToHandle.current.type = 'page';
    contentToHandle.current.content = page;
    setIsDeleteModalContentOpen(true);
  };

  const addTask = page => {
    contentToHandle.current.type = 'page';
    contentToHandle.current.content = page;

    setIsAssignPageModalOpen(true);

    // localStorage.setItem(page.id, JSON.stringify({ ...page, courseId: course?.id, courseName: course?.name, assignedBy: session.user }));
    // router.push(`/tools/tasks/task?show=true&prev=course-page-assign&prev_id=${page.id}`);
  };

  const refetch = () => {
    if (contentToHandle.current.type === 'page') {
      fetchCourseFolderDetails();
    } else {
      refetchAccordionItems();
    }
  };

  useEffect(() => {
    setCourseFolderPages(courseFolder?.pages || []);
  }, [courseFolder?.pages]);

  return (
    <div className="mt-1.5">
      <AccordionItem
        title={courseFolderDetails.name}
        isOpen={isOpen}
        onToggle={onToggle}
        itemType="folder"
        actions={{ editCourseFolder, addNewPage, deleteCourseFolder }}
        isCompleted={courseFolder.isCompleted}
      >
        {courseFolderPages?.length > 0 &&
          courseFolderPages.map((page, i) => {
            const isFirstElement = i === 0;
            const isLastElement = i === countCourseFolderPages - 1;
            const isSelected = contentSelected?.id === page.id;

            return (
              <div key={page.id} className={`${isFirstElement || isLastElement ? '' : 'my-1'}`}>
                <CourseFolderPage
                  page={page}
                  isSelected={isSelected}
                  onSelectPage={() => onSelectPage(page, i)}
                  editPage={() => editPage(page)}
                  duplicatePage={() => duplicatePage(page)}
                  changeCourseFolder={() => changeCourseFolder(page, courseFolder)}
                  deletePage={() => deletePage(page)}
                  isCompleted={page.isCompleted}
                  addTask={() => addTask(page)}
                />
              </div>
            );
          })}

        {hasPermission(LMS_PERMISSIONS.addPage) && <NewPageButton onClick={addNewPage} />}
      </AccordionItem>

      <AssignPageModal course={course} page={contentToHandle.current.content} isOpen={isAssignPageModalOpen} setIsOpen={setIsAssignPageModalOpen} />

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

      <ChangeFolderForm
        page={contentToHandle.current.content?.page}
        currentFolder={contentToHandle.current.content?.folder}
        isOpen={isChangeFolderModalOpen}
        setIsOpen={setIsChangeFolderModalOpen}
        folders={folders}
        onSuccess={refetch}
      />
    </div>
  );
};
