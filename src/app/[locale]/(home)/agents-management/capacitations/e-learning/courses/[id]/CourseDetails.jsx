'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';

import { LoadingSpinnerSmall } from '@/src/components/LoaderSpinner';

import { CourseFolder } from '../components/CourseFolder';
import { NewCourseFolderButton } from '../components/NewCourseFolderButton';
import { NewContentForm } from '../components/NewContentForm';
import { ConfirmUncheckAsCompleted } from '../components/ConfirmUncheckAsCompleted';
import { ContentView } from '../components/ContentView';
import { CourseCreateEditModal } from '../../components/CourseCreateEditModal';
import { DeleteContentModal } from '../../components/DeleteContentModal';

import { useCourseFolderPages } from '../../hooks/useCourseFolderPages';
// import { useCourseFolders } from '../../hooks/useCourseFolders';
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

  const markAsCompleted = () => {
    const toggled = !content.data.isCompleted;

    toggleCourseFolderPageAsCompleted(content.data.id, toggled).then(() => {
      toast.info(`Contenido marcado como ${toggled ? 'completado' : 'no completado'}`);

      // fetchModuleDetails().then(() => fetchContentDetails());

      // setCourse(prev => ({
      //   ...prev,
      //   folders: prev.folders.map(folder => {
      //     return {
      //       ...folder,
      //       pages: folder.pages.map(page => {
      //         if (page.id === content.data.id) return { ...page, isCompleted: toggled };

      //         return page;
      //       }),
      //     };
      //   }),
      // }));

      // setContent(prev => ({ ...prev, data: { ...prev.data, isCompleted: toggled } }));
      // setContentDetails(prev => ({ ...prev, isCompleted: toggled }));
    });
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

  // const fetchContentDetails = useCallback(async () => {
  //   if (!content || !content.data) return;
  //   setLoading(true);

  //   try {
  //     const result = await getCourseFolderPage(content.data.id);

  //     if (result) setContentDetails(result);
  //   } catch (error) {
  //     toast.error('Tenemos problemas para cargar el contenido. Por favor intente más tarde');
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [getCourseFolderPage, content]);

  useEffect(() => {
    fetchModuleDetails();
  }, [fetchModuleDetails]);

  // useEffect(() => {
  //   fetchContentDetails();
  // }, [fetchContentDetails]);

  useEffect(() => {
    if (!hasPermission(LMS_PERMISSIONS.courseDetails)) router.replace('/');
  }, [hasPermission, router]);

  if (!course && !fetchingModuleDetails) {
    return <div>Module not found</div>; // TODO: Mejorar este componente
  }

  if (fetchingModuleDetails)
    return (
      <div className="h-48 w-full bg-white rounded-xl">
        <LoadingSpinnerSmall />
      </div>
    );

  return (
    <div className="pt-2 pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
        <div className="bg-gray-100 rounded-xl border border-gray-100 overflow-y-auto h-[71vh] [&::-webkit-scrollbar]:hidden">
          <div className="rounded-xl border-easy-400 bg-easy-50 p-4" style={{ borderWidth: '1px', borderStyle: 'solid' }}>
            <div className="flex items-center justify-between">
              <span className="text-gray-900 font-bold text-lg">{course.name}</span>
              <div className="flex items-center justify-center gap-2">
                {hasPermission(LMS_PERMISSIONS.coursesMoreMenu) && <AccordionItemMoreMenu itemType="course" actions={{ editCourse, addNewCourseFolder, addNewPage, deleteCourse }} />}
              </div>
            </div>
            <CourseProgressBar progress={course.progress} />
          </div>

          {hasFolders &&
            course.folders.map((courseFolder, folderIndex, self) => (
              <CourseFolder
                key={courseFolder.id}
                folders={self}
                courseFolder={courseFolder}
                isOpen={!closedSections.includes(courseFolder.name)}
                onToggle={() => toggleSection(courseFolder.name)}
                onSelectPage={(page, pageIndex) => {
                  if (page.id === content.data?.id) return;

                  setContent({ data: page, folderIndex, pageIndex });
                }}
                // refetchContentDetails={fetchContentDetails}
                refetchAccordionItems={fetchModuleDetails}
              />
            ))}

          {hasPermission(LMS_PERMISSIONS.addFolder) && <NewCourseFolderButton onClick={() => setIsNewContentFormOpen(true)} />}
        </div>

        <div className="relative">
          <div className="h-[71vh]">
            {content.data && <ContentView content={content.data} onToggleIsCompleted={onToggleIsCompleted} />}
            {/* {loading ? (
              <div className="h-48 w-full bg-white rounded-xl">
                <LoadingSpinnerSmall />
              </div>
            ) : (
              content.data && <ContentView content={content.data} onToggleIsCompleted={onToggleIsCompleted} />
            )} */}
          </div>

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
