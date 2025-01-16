'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { CourseCard } from './CourseCard';
import { CourseCreateEditModal } from './CourseCreateEditModal';
import { DeleteContentModal } from './DeleteContentModal';

import { useCourses } from '../hooks/useCourses';

export const CoursesGrid = ({ showCreateButton = false }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getCourses } = useCourses();

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

  const fetchCourses = useCallback(async () => {
    setLoading(true);

    try {
      const courses = await getCourses();
      setCourses(courses?.data || []);
    } catch (error) {
      toast.error('Algo no ha salido bien obteniendo los cursos. Intente más tarde');
    } finally {
      setLoading(false);
    }
  }, [getCourses]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  if (loading) {
    return (
      <div className="flex items-center justify-center flex-col gap-4 h-[500px] w-full">
        <div className={`w-10 h-10 animate-spin rounded-full border-t-2 border-b-2 border-easy-400`} />
        <p>Obteniendo cursos...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-y-5 py-5">
      {showCreateButton && (
        <div className="h-[360px] xs:w-full md:w-[300px] flex items-center justify-center bg-gray-300 rounded-xl hover:shadow-lg transition-shadow">
          <button onClick={onCreateCourse} className="w-full h-full flex items-center justify-center">
            <p className="font-bold text-gray-400">+ Nuevo curso</p>
          </button>
        </div>
      )}

      {courses.map(course => (
        <CourseCard key={course.id} course={course} onEditCourse={onEditCourse} onMoveCourse={onMoveCourse} onDeleteCourse={onDeleteCourse} />
      ))}

      <CourseCreateEditModal isOpen={isEditCreateModalOpen} setIsOpen={setIsEditCreateModalOpen} course={courseRef.current} onSuccess={fetchCourses} />
      <DeleteContentModal isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen} content={courseRef.current} contentType="course" />
    </div>
  );
};
