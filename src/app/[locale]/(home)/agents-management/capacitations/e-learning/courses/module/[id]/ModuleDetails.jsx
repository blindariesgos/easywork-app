'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

import { AccordionItem } from '../components/AccordionItem';
import { ModuleContent } from '../components/ModuleContent';
import { Lesson } from '../components/Lesson';
import { NewLessonButton } from '../components/NewLessonButton';
import { NewLessonForm } from '../components/NewLessonForm';
import { NewContentForm } from '../components/NewContentForm';
import { ContentView } from '../components/ContentView';

import { getCourseById } from '../../services/get-courses';

export const ModuleDetails = ({ courseId }) => {
  const [openSections, setOpenSections] = useState(['']);
  const [course, setCourse] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const hasLessons = course?.lessons?.length > 0;
  const [showNewLessonForm, setShowNewLessonForm] = useState(!hasLessons);
  const [isNewContentFormOpen, setIsNewContentFormOpen] = useState(false);

  const toggleSection = section => {
    setOpenSections(prev => (prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]));
  };

  const fetchModuleDetails = useCallback(async () => {
    try {
      const courseFetched = await getCourseById(courseId);
      setCourse(courseFetched);
      if (courseFetched.lessons?.length > 0) setSelectedContent(courseFetched.lessons[0]);
    } catch (error) {
      console.log(error);
      toast.error('Algo ha salido mal. Por favor intenta más tarde');
    }
  }, [courseId]);

  const editCourse = () => {};
  const addNewLesson = () => {
    setIsNewContentFormOpen(true);
  };
  const addNewPage = () => {};
  const deleteCourse = () => {};

  useEffect(() => {
    fetchModuleDetails();
  }, [fetchModuleDetails]);

  if (!course) {
    return <div>Module not found</div>;
  }

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
                    if (selectedContent.name !== lesson.name) setSelectedContent(lesson);
                  }}
                />
              ))
            ) : (
              <NewLessonButton onClick={() => setIsNewContentFormOpen(true)} />
            )}
          </AccordionItem>

          {/* {hasLessons ? (
            course.lessons.map(lesson => <Lesson key={lesson.id} lesson={lesson} />)
          ) : (
            <NewLessonButton
              onClick={() => {
                // toast.info('🙅🏻‍♂️ Su desarrollador de confianza está trabajando en ello 👷🏻⚙️');
                setShowNewLessonForm(true);
              }}
            />
          )} */}

          {/* <AccordionItem title="Module 1" isPrimaryItem isOpen={openSections.includes('overview')} onToggle={() => toggleSection('overview')} progress={25} childrenClassName="p-0">
            <AccordionItem
              title="Ciclo de ventas"
              isOpen={openSections.includes('sales-cicle')}
              onToggle={() => toggleSection('sales-cicle')}
              childrenClassName="p-0"
              titleBordered={false}
              borderColor="border-gray-300"
            >
              <p className="bg-gray-600 text-black p-4 w-full rounded-md">Capitulo III</p>
              <p className="bg-gray-600 text-black p-4 w-full rounded-md my-1">Capitulo III</p>
              <p className="bg-gray-600 text-black p-4 w-full rounded-md">Capitulo III</p>
            </AccordionItem>
            <AccordionItem title="Intro GNP" isOpen={openSections.includes('gnp')} onToggle={() => toggleSection('gnp')} childrenClassName="p-0" titleBordered={false} borderColor="border-gray-300">
              <p className="bg-gray-600 text-black p-4 w-full rounded-md">Capitulo III</p>
              <p className="bg-gray-600 text-black p-4 w-full rounded-md my-1">Capitulo III</p>
              <p className="bg-gray-600 text-black p-4 w-full rounded-md">Capitulo III</p>
            </AccordionItem>
            <AccordionItem
              title="Productos y comisiones"
              isOpen={openSections.includes('products')}
              onToggle={() => toggleSection('products')}
              childrenClassName="p-0"
              titleBordered={false}
              borderColor="border-gray-300"
            >
              <p className="bg-gray-600 text-black p-4 w-full rounded-md">Capitulo III</p>
              <p className="bg-gray-600 text-black p-4 w-full rounded-md my-1">Capitulo III</p>
              <p className="bg-gray-600 text-black p-4 w-full rounded-md">Capitulo III</p>
            </AccordionItem>
          </AccordionItem> */}
        </div>

        <div>
          <ContentView course={course} content={selectedContent} onSuccess={fetchModuleDetails} />
        </div>

        {/* <div className="bg-white rounded-xl" style={{ borderWidth: '1px', borderStyle: 'solid' }}> */}
        {/* <ModuleContent content={course} /> */}

        {/* <NewLessonForm course={course} /> */}
        {/* <ContentView course={course} content={selectedContent} /> */}

        {/* {!hasLessons ? (
            <NewLessonForm
              course={course}
              // onSuccess={() => {
              //   setShowNewLessonForm(false);
              // }}
            />
          ) : (
            <ModuleContent
              course={course}
              onNavigate={id => {
                setOpenSections(['overview']);
                projectId = id;
              }}
            />
          )} */}
      </div>

      <NewContentForm isOpen={isNewContentFormOpen} setIsOpen={setIsNewContentFormOpen} contentType="lesson" parent={course} onSuccess={fetchModuleDetails} />
    </div>
  );
};
