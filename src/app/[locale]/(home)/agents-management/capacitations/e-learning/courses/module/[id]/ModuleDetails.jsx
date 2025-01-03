'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

import { AccordionItem } from '../components/AccordionItem';
import { Lesson } from '../components/Lesson';
import { NewLessonButton } from '../components/NewLessonButton';
import { NewContentForm } from '../components/NewContentForm';
import { ContentView } from '../components/ContentView';

import { getCourseById } from '../../services/get-courses';
import { getLesson } from '../services/lessons';
import { getLessonPage } from '../services/lesson-pages';
import { LoadingSpinnerSmall } from '@/src/components/LoaderSpinner';
import CourseCreateEditModal from '../../../components/CourseCreateEditModal';
import DeleteContentModal from '../../../components/DeleteContentModal';
import { useRouter } from 'next/navigation';

export const ModuleDetails = ({ courseId }) => {
  const router = useRouter();

  const [openSections, setOpenSections] = useState([]);
  const [course, setCourse] = useState(null);
  const [selectedContent, setSelectedContent] = useState({ item: null, type: '' });
  const hasLessons = course?.lessons?.length > 0;
  const [showNewLessonForm, setShowNewLessonForm] = useState(!hasLessons);
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
      setCourse(courseFetched);

      if (courseFetched.lessons?.length > 0) setSelectedContent({ item: courseFetched.lessons[0], type: 'lesson' });
    } catch (error) {
      console.log(error);
      toast.error('Algo ha salido mal. Por favor intenta más tarde');
    } finally {
      setFetchingModuleDetails(false);
    }
  }, [courseId]);

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
  }, [selectedContent]);

  useEffect(() => {
    fetchModuleDetails();
  }, [fetchModuleDetails]);

  useEffect(() => {
    fetchContentDetails();
  }, [fetchContentDetails]);

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
          <AccordionItem
            title={course.name}
            isPrimaryItem
            isOpen={openSections.includes(course.name)}
            onToggle={() => toggleSection(course.name)}
            progress={20}
            childrenClassName="p-0"
            itemType="course"
            actions={{ editCourse, addNewLesson, addNewPage, deleteCourse }}
          >
            {hasLessons ? (
              course.lessons.map(lesson => (
                <Lesson
                  key={lesson.id}
                  lesson={lesson}
                  isOpen={openSections.includes(lesson.name)}
                  onToggle={() => {
                    toggleSection(lesson.name);
                    // if (selectedContent.name !== lesson.name) setSelectedContent({ item: lesson, type: 'lesson' });
                  }}
                  onSelectLesson={() => setSelectedContent({ item: lesson, type: 'lesson' })}
                  onSelectPage={page => setSelectedContent({ item: page, type: 'page' })}
                />
              ))
            ) : (
              <NewLessonButton onClick={() => setIsNewContentFormOpen(true)} />
            )}
          </AccordionItem>
        </div>

        <div>
          {loading ? (
            <div className="h-48 w-full bg-white rounded-xl">
              <LoadingSpinnerSmall />
            </div>
          ) : (
            <ContentView course={course} content={contentDetails} contentType={selectedContent.type} />
          )}
        </div>
      </div>

      <CourseCreateEditModal isOpen={isEditCourseModalOpen} setIsOpen={setIsEditModalCourseOpen} course={course} onSuccess={() => fetchModuleDetails()} />
      <DeleteContentModal isOpen={isDeleteContentModalOpen} setIsOpen={setIsDeleteModalCourseOpen} content={course} onSuccess={() => redirectToCourses()} contentType="course" />
      <NewContentForm isOpen={isNewContentFormOpen} setIsOpen={setIsNewContentFormOpen} contentType="lesson" parent={course} onSuccess={fetchModuleDetails} />
    </div>
  );
};
