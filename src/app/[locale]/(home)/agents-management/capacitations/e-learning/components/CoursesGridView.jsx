'use client';

import { useRef, useState } from 'react';

import ModuleCard from '../components/ModuleCard';
import CourseCreateEditModal from './CourseCreateEditModal';
import DeleteCourseModal from './DeleteCourseModal';

export default function CoursesGridView({ courses }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const courseRef = useRef(null);

  const onEditCourse = course => {
    courseRef.current = course;
    setIsEditModalOpen(true);
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
      {courses.map(course => (
        <ModuleCard key={course.id} course={course} onEditCourse={onEditCourse} onMoveCourse={onMoveCourse} onDeleteCourse={onDeleteCourse} />
      ))}

      <CourseCreateEditModal isOpen={isEditModalOpen} setIsOpen={setIsEditModalOpen} course={courseRef.current} />
      <DeleteCourseModal isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen} course={courseRef.current} />
    </div>
  );
}
