'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';

import { LoadingSpinnerSmall } from '@/src/components/LoaderSpinner';

import { Lesson } from '../components/Lesson';
import { NewLessonButton } from '../components/NewLessonButton';
import { NewContentForm } from '../components/NewContentForm';
import { ContentView } from '../components/ContentView';
import { CourseCreateEditModal } from '../../components/CourseCreateEditModal';
import { DeleteContentModal } from '../../components/DeleteContentModal';

import { useLessonPages } from '../../hooks/useLessonPages';
import { useLessons } from '../../hooks/useLessons';
import { useCourses } from '../../hooks/useCourses';

import { AccordionItemMoreMenu } from '../components/AccordionItemMoreMenu';
import { CourseProgressBar } from '../../components/CourseProgressBar';
import { useUserPermissions } from '../../../hooks/useUserPermissions';
import { LMS_PERMISSIONS } from '../../../constants';

export const CourseDetails = ({ courseId }) => {
  const router = useRouter();
  const { hasPermission } = useUserPermissions();

  const { getCourseById } = useCourses();
  const { getLesson } = useLessons();
  const { getLessonPage } = useLessonPages();

  const [openSections, setOpenSections] = useState([]);
  const [course, setCourse] = useState(null);
  const [selectedContent, setSelectedContent] = useState({ item: null, type: '', lessonIndex: 0, pageIndex: 0 });
  const hasLessons = course?.lessons?.length > 0;
  const [isNewContentFormOpen, setIsNewContentFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingModuleDetails, setFetchingModuleDetails] = useState(true);
  const [isEditCourseModalOpen, setIsEditModalCourseOpen] = useState(false);
  const [isDeleteContentModalOpen, setIsDeleteModalCourseOpen] = useState(false);
  const [contentDetails, setContentDetails] = useState(null);

  const toggleSection = section => {
    setOpenSections(prev => (prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]));
  };

  const fetchModuleDetails = useCallback(async () => {
    setFetchingModuleDetails(true);

    try {
      const courseFetched = await getCourseById(courseId);
      if (!courseFetched) return;

      setCourse(courseFetched);
      setOpenSections([courseFetched.name]);

      if (courseFetched.lessons?.length > 0) setSelectedContent({ item: courseFetched.lessons[0], type: 'lesson', index: 0 });
    } catch (error) {
      console.log(error);
      toast.error('Algo ha salido mal. Por favor intenta más tarde');
    } finally {
      setFetchingModuleDetails(false);
    }
  }, [courseId, getCourseById]);

  const editCourse = () => {
    setIsEditModalCourseOpen(true);
  };
  const addNewLesson = () => {
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
    if (!hasLessons) return;

    if (selectedContent.type === 'lesson') {
      const lesson = course.lessons[selectedContent.lessonIndex];

      setSelectedContent(prev => ({ ...prev, item: lesson.pages[0], type: 'page', pageIndex: 0 }));
    } else {
      const lesson = course.lessons[selectedContent.lessonIndex];
      const page = lesson.pages[selectedContent.pageIndex + 1];

      setSelectedContent(prev => ({ ...prev, item: page || lesson, type: page ? 'page' : 'lesson', pageIndex: page ? selectedContent.pageIndex + 1 : 0 }));
    }
  };
  const goPreviousContent = () => {
    if (!hasLessons) return;
  };

  const fetchContentDetails = useCallback(async () => {
    if (!selectedContent) return;
    setLoading(true);

    try {
      const content = { ...selectedContent };
      let result = null;

      if (content.type === 'lesson') {
        result = await getLesson(content.item.id);
      } else if (content.type === 'page') {
        result = await getLessonPage(content.item.id);
      }

      if (result) setContentDetails(result);
    } catch (error) {
      toast.error('Tenemos problemas para cargar el contenido. Por favor intente más tarde');
    } finally {
      setLoading(false);
    }
  }, [getLesson, getLessonPage, selectedContent]);

  useEffect(() => {
    fetchModuleDetails();
  }, [fetchModuleDetails]);

  useEffect(() => {
    fetchContentDetails();
  }, [fetchContentDetails]);

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
    <div className="py-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 pb-10">
        <div className="bg-gray-100 rounded-xl border border-gray-100">
          <div className="rounded-xl border-easy-400 bg-easy-50 p-4" style={{ borderWidth: '1px', borderStyle: 'solid' }}>
            <div className="flex items-center justify-between">
              <span className="text-gray-900 font-bold text-lg">{course.name}</span>
              <div className="flex items-center justify-center gap-2">
                <AccordionItemMoreMenu itemType="course" actions={{ editCourse, addNewLesson, addNewPage, deleteCourse }} />
              </div>
            </div>
            <CourseProgressBar progress={course.progress} />
          </div>

          {hasLessons &&
            course.lessons.map((lesson, index) => (
              <Lesson
                key={lesson.id}
                lesson={lesson}
                isOpen={openSections.includes(lesson.name)}
                onToggle={() => toggleSection(lesson.name)}
                onSelectLesson={() => setSelectedContent({ item: lesson, type: 'lesson', lessonIndex: index, pageIndex: 0 })}
                onSelectPage={(page, i) => setSelectedContent({ item: page, type: 'page', lessonIndex: index, pageIndex: i })}
                refetchContentDetails={fetchContentDetails}
                refetchAccordionItems={fetchModuleDetails}
              />
            ))}

          <NewLessonButton onClick={() => setIsNewContentFormOpen(true)} />

          {/* <AccordionItem
            title={course.name}
            isPrimaryItem
            isOpen={openSections.includes(course.name)}
            onToggle={() => toggleSection(course.name)}
            progress={course.progress}
            childrenClassName="p-0"
            itemType="course"
            actions={{ editCourse, addNewLesson, addNewPage, deleteCourse }}
          >
            {hasLessons ? (
              course.lessons.map((lesson, index) => (
                <Lesson
                  key={lesson.id}
                  lesson={lesson}
                  isOpen={openSections.includes(lesson.name)}
                  onToggle={() => toggleSection(lesson.name)}
                  onSelectLesson={() => setSelectedContent({ item: lesson, type: 'lesson', lessonIndex: index, pageIndex: 0 })}
                  onSelectPage={(page, i) => setSelectedContent({ item: page, type: 'page', lessonIndex: index, pageIndex: i })}
                  refetchContentDetails={fetchContentDetails}
                  refetchAccordionItems={fetchModuleDetails}
                />
              ))
            ) : (
              <NewLessonButton onClick={() => setIsNewContentFormOpen(true)} />
            )}
          </AccordionItem> */}
        </div>

        <div>
          {loading ? (
            <div className="h-48 w-full bg-white rounded-xl">
              <LoadingSpinnerSmall />
            </div>
          ) : (
            <ContentView course={course} content={contentDetails} contentType={selectedContent.type} refetchAccordionItems={fetchModuleDetails} />
          )}

          <div className="flex items-center justify-between gap-1 mt-5">
            <div className="flex flex-wrap gap-2">
              <button className={`bg-blue-100 px-3 py-2 text-white rounded-lg font-bold flex items-center justify-between gap-2`} disabled={loading} onClick={goPreviousContent}>
                <MdOutlineKeyboardArrowLeft className={`h-4 w-4 bg-gray-100 rounded-full text-black ${selectedContent.index === 0 && 'opacity-60'}`} aria-hidden="true" />
                Lección anterior
              </button>
              <button className="bg-blue-100 px-3 py-2 text-white rounded-lg font-bold flex items-center justify-between gap-2" onClick={goNextContent}>
                Lección siguiente
                <MdOutlineKeyboardArrowRight className="h-4 w-4 bg-gray-100 rounded-full text-black" aria-hidden="true" />
              </button>
            </div>
            <div>
              <button className={`bg-${selectedContent.item?.isCompleted ? 'blue-100' : 'gray-50'} px-3 py-2 text-white rounded-lg font-bold`}>
                {selectedContent.item?.isCompleted ? 'Lección completada' : 'Completar lección'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <CourseCreateEditModal isOpen={isEditCourseModalOpen} setIsOpen={setIsEditModalCourseOpen} course={course} onSuccess={() => fetchModuleDetails()} />
      <DeleteContentModal isOpen={isDeleteContentModalOpen} setIsOpen={setIsDeleteModalCourseOpen} content={course} onSuccess={() => redirectToCourses()} contentType="course" />
      <NewContentForm isOpen={isNewContentFormOpen} setIsOpen={setIsNewContentFormOpen} contentType="lesson" parent={course} onSuccess={fetchModuleDetails} />
    </div>
  );
};