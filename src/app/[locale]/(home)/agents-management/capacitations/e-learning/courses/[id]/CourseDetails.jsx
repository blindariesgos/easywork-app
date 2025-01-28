'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';

import { CourseFolder } from '../components/CourseFolder';
import { NewCourseFolderButton } from '../components/NewCourseFolderButton';
import { NewContentForm } from '../components/NewContentForm';
import { ConfirmUncheckAsCompleted } from '../components/ConfirmUncheckAsCompleted';
import { ContentView } from '../components/ContentView';
import { CourseCreateEditModal } from '../../components/CourseCreateEditModal';
import { DeleteContentModal } from '../../components/DeleteContentModal';

import { useCourseFolderPages } from '../../hooks/useCourseFolderPages';
import { useCourses } from '../../hooks/useCourses';

import { AccordionItemMoreMenu } from '../components/AccordionItemMoreMenu';
import { CourseProgressBar } from '../../components/CourseProgressBar';
import { useUserPermissions } from '../../../hooks/useUserPermissions';
import { LMS_PERMISSIONS } from '../../../constants';

export const CourseDetails = ({ courseId }) => {
  // Hooks
  const router = useRouter();
  const { hasPermission } = useUserPermissions();
  const { getCourseById } = useCourses({ fetchOnMount: false });
  const { toggleCourseFolderPageAsCompleted } = useCourseFolderPages();

  // States
  const [closedSections, setClosedSections] = useState([]);

  // States - Loaders
  const [fetchingModuleDetails, setFetchingModuleDetails] = useState(true);

  // States - Modales
  const [isNewContentFormOpen, setIsNewContentFormOpen] = useState(false);
  const [isUncheckAsCompleteModalOpen, setIsUncheckAsCompleteModalOpen] = useState(false);
  const [isEditCourseModalOpen, setIsEditModalCourseOpen] = useState(false);
  const [isDeleteContentModalOpen, setIsDeleteModalCourseOpen] = useState(false);

  // States - primary
  const [course, setCourse] = useState(null);
  const [content, setContent] = useState({ data: null, folderIndex: 0, pageIndex: 0 });
  // const [contentDetails, setContentDetails] = useState(null);

  // Definitions
  const hasFolders = course?.folders?.length > 0;
  const isFirstElement = content.folderIndex === 0 && content.pageIndex === 0;
  const isLastElement = content.folderIndex === course?.folders.length - 1 && content.pageIndex === course?.folders[content.folderIndex]?.pages.length - 1;

  const toggleSection = section => {
    setClosedSections(prev => (prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]));
  };

  const editCourse = () => {
    setIsEditModalCourseOpen(true);
  };
  const addNewCourseFolder = () => {
    setIsNewContentFormOpen(true);
  };

  const addNewPage = () => {
    toast.info('En construcción 🚧');
  };

  const deleteCourse = () => {
    setIsDeleteModalCourseOpen(true);
  };

  const redirectToCourses = () => {
    router.push('/agents-management/capacitations/e-learning/courses');
  };

  const goNextContent = () => {
    if (!hasFolders) return;

    let { pageIndex, folderIndex } = content;

    if (!folderIndex) folderIndex = 0;

    const currentFolder = course.folders[folderIndex || 0];

    if (pageIndex < currentFolder.pages.length - 1) {
      pageIndex++;
    } else if (folderIndex < course.folders.length - 1) {
      folderIndex++;
      pageIndex = 0;
    }

    setContent({ data: course.folders[folderIndex].pages[pageIndex], type: 'page', folderIndex, pageIndex });
  };

  const goPreviousContent = () => {
    if (!hasFolders) return;
    let { pageIndex, folderIndex } = content;

    if (!folderIndex) folderIndex = 0;

    if (pageIndex > 0) {
      pageIndex--;
    } else if (folderIndex > 0) {
      folderIndex--;
      const previousFolder = course.folders[folderIndex];
      pageIndex = previousFolder.pages.length - 1;
    }

    setContent({ data: course.folders[folderIndex].pages[pageIndex], type: 'page', folderIndex, pageIndex });
  };

  const updateCompletedPages = (pageId, toggled) => {
    try {
      setContent(prev => ({ ...prev, data: { ...prev.data, isCompleted: toggled } }));
      setCourse(prev => {
        const folders = [...prev.folders];

        prev.folders = folders.map(folder => {
          const { pages } = folder;

          const index = pages.findIndex(page => pageId === page.id);
          if (index === -1) return folder;

          folder.pages[index].isCompleted = toggled;
          return folder;
        });

        return prev;
      });
    } catch (error) {
      toast.error('Algo ha salido mal al intentar actualizar las lecciones completadas. Intente más tarde por favor');
    }
  };

  const markAsCompleted = async () => {
    const contentToToggle = { ...content.data };
    const toggled = !content.data.isCompleted;

    try {
      toast.info(`Guardando...`);
      updateCompletedPages(contentToToggle.id, toggled);
      await toggleCourseFolderPageAsCompleted(contentToToggle.id, toggled);

      const courseFetched = await getCourseById(courseId);
      if (!courseFetched) return;

      setCourse(courseFetched);

      toast.success(`Contenido marcado como ${toggled ? 'completado' : 'no completado'}`);
    } catch (error) {
      updateCompletedPages(contentToToggle.id, contentToToggle.isCompleted);
      toast.info('Algo no ha salido muy bien. Por favor intente más tarde');
    }
  };

  const onToggleIsCompleted = () => {
    if (content.data.isCompleted) {
      setIsUncheckAsCompleteModalOpen(true);
    } else {
      markAsCompleted();
    }
  };

  const fetchModuleDetails = useCallback(async () => {
    setFetchingModuleDetails(true);

    try {
      const courseFetched = await getCourseById(courseId);
      if (!courseFetched) return;

      setCourse(courseFetched);

      if (courseFetched.folders[0] && courseFetched.folders[0].pages.length > 0) {
        setContent({ data: courseFetched.folders[0].pages[0], folderIndex: 0, pageIndex: 0 });
      }
    } catch (error) {
      toast.error('Algo ha salido mal. Por favor intenta más tarde');
    } finally {
      setFetchingModuleDetails(false);
    }
  }, [courseId, getCourseById]);

  useEffect(() => {
    fetchModuleDetails();
  }, [fetchModuleDetails]);

  useEffect(() => {
    if (!hasPermission(LMS_PERMISSIONS.courseDetails)) router.replace('/');
  }, [hasPermission, router]);

  if (!course && !fetchingModuleDetails) {
    return <div>Module not found</div>; // TODO: Mejorar este componente
  }

  if (fetchingModuleDetails)
    return (
      <div className="h-[71vh] w-full bg-white rounded-xl flex flex-col gap-4 items-center justify-center">
        <div className={`w-10 h-10 animate-spin rounded-full border-t-2 border-b-2 border-easy-400`} />
        <p className="text-sm">
          Obteniendo detalles del curso<span className="text-easy-400">...</span>
        </p>
      </div>
    );

  return (
    <div className="pt-2 pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 h-[calc(100vh-300px)]">
        <div className="bg-gray-100 rounded-xl border border-gray-100 overflow-y-auto [&::-webkit-scrollbar]:hidden h-full">
          <div className="rounded-xl border-easy-400 bg-easy-50 py-4 pl-4 pr-2" style={{ borderWidth: '1px', borderStyle: 'solid' }}>
            <div className="flex items-center justify-between">
              <span className="text-gray-900 font-bold text-lg">{course.name}</span>
              {hasPermission(LMS_PERMISSIONS.coursesMoreMenu) && <AccordionItemMoreMenu itemType="course" actions={{ editCourse, addNewCourseFolder, addNewPage, deleteCourse }} />}
            </div>

            <CourseProgressBar progress={course.progress} />
          </div>

          {hasFolders &&
            course.folders.map((courseFolder, folderIndex, self) => (
              <CourseFolder
                key={courseFolder.id}
                folders={self}
                courseFolder={courseFolder}
                contentSelected={content.data}
                isOpen={!closedSections.includes(courseFolder.name)}
                onToggle={() => toggleSection(courseFolder.name)}
                onSelectPage={(page, pageIndex) => {
                  if (page.id === content.data?.id) return;

                  setContent({ data: page, folderIndex, pageIndex });
                }}
                refetchAccordionItems={fetchModuleDetails}
              />
            ))}

          {hasPermission(LMS_PERMISSIONS.addFolder) && <NewCourseFolderButton onClick={() => setIsNewContentFormOpen(true)} />}
        </div>

        <div className="relative h-full">
          {content.data && <ContentView content={content.data} onToggleIsCompleted={onToggleIsCompleted} />}

          {content.data && (
            <div className="bg-gray-100 w-full flex items-center justify-between gap-1 absolute bottom-0 pt-5">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`bg-easy-400 px-3 py-2 text-white rounded-lg font-bold flex items-center justify-between gap-2 ${isFirstElement && 'opacity-40'}`}
                  disabled={isFirstElement}
                  onClick={goPreviousContent}
                >
                  <MdOutlineKeyboardArrowLeft className="h-4 w-4 bg-gray-100 rounded-full text-black" aria-hidden="true" />
                  Lección anterior
                </button>

                <button
                  type="button"
                  disabled={isLastElement}
                  className={`bg-easy-400 px-3 py-2 text-white rounded-lg font-bold flex items-center justify-between gap-2 ${isLastElement && 'opacity-40'}`}
                  onClick={goNextContent}
                >
                  Lección siguiente
                  <MdOutlineKeyboardArrowRight className="h-4 w-4 bg-gray-100 rounded-full text-black" aria-hidden="true" />
                </button>
              </div>
              {hasPermission(LMS_PERMISSIONS.markAsCompleted) && (
                <div>
                  <button onClick={onToggleIsCompleted} className={`bg-${content.data?.isCompleted ? 'easy-400' : 'gray-50'} px-3 py-2 text-white rounded-lg font-bold mr-20`}>
                    {content.data?.isCompleted ? 'Lección completada' : 'Completar lección'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <CourseCreateEditModal isOpen={isEditCourseModalOpen} setIsOpen={setIsEditModalCourseOpen} course={course} onSuccess={() => fetchModuleDetails()} />
      <DeleteContentModal isOpen={isDeleteContentModalOpen} setIsOpen={setIsDeleteModalCourseOpen} content={course} onSuccess={() => redirectToCourses()} contentType="course" />
      <NewContentForm isOpen={isNewContentFormOpen} setIsOpen={setIsNewContentFormOpen} contentType="folder" parent={course} onSuccess={fetchModuleDetails} />
      <ConfirmUncheckAsCompleted isOpen={isUncheckAsCompleteModalOpen} setIsOpen={setIsUncheckAsCompleteModalOpen} onConfirm={markAsCompleted} />
    </div>
  );
};
