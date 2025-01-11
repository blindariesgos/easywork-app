'use client';

import { useRef, useState } from 'react';

import { ModuleCard } from './ModuleCard';
import { CourseCreateEditModal } from './CourseCreateEditModal';
import { DeleteContentModal } from './DeleteContentModal';

import { useCourses } from '../hooks/useCourses';

export const CoursesGrid = ({ showCreateButton = false }) => {
  const { courses, refetch } = useCourses();

  const [isEditCreateModalOpen, setIsEditCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const courseRef = useRef(null);

  const onCreateCourse = () => {
    courseRef.current = null;
    setIsEditCreateModalOpen(true);
  };

  const onEditCourse = course => {
    courseRef.current = course;
    setIsEditCreateModalOpen(true);
  };

  const onMoveCourse = course => {
    courseRef.current = course;
  };

  const onDeleteCourse = course => {
    courseRef.current = course;
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-5 px-10">
      {showCreateButton && (
        <div className="h-96 flex items-center justify-center bg-gray-300 rounded-xl hover:shadow-lg transition-shadow">
          <button onClick={onCreateCourse} className="w-full h-full flex items-center justify-center">
            <p className="font-bold text-gray-400">+ Nuevo curso</p>
          </button>
        </div>
      )}

      {courses.map(course => (
        <ModuleCard key={course.id} course={course} onEditCourse={onEditCourse} onMoveCourse={onMoveCourse} onDeleteCourse={onDeleteCourse} />
      ))}

      <CourseCreateEditModal isOpen={isEditCreateModalOpen} setIsOpen={setIsEditCreateModalOpen} course={courseRef.current} onSuccess={refetch} />
      <DeleteContentModal isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen} content={courseRef.current} contentType="course" />
    </div>
  );
};
