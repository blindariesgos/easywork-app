'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { CourseCard } from './CourseCard';
import { CourseCreateEditModal } from './CourseCreateEditModal';
import { AssignCourseModal } from './AssignCourseModal';
import { DeleteContentModal } from './DeleteContentModal';

import { PaginationV2 } from '@/src/components/pagination/PaginationV2';

import { useCourses } from '../hooks/useCourses';
import { toast } from 'react-toastify';

export const CoursesGrid = ({ showCreateButton = false }) => {
  const [courses, setCourses] = useState({ pagesCount: 1, count: 0, data: [] });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { getCourses, updateOrder } = useCourses();

  const [isEditCreateModalOpen, setIsEditCreateModalOpen] = useState(false);
  const [isAssignCourseModalOpen, setIsAssignCourseModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const courseRef = useRef(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);

    try {
      const courses = await getCourses({ params: { page } });
      setCourses(courses || []);
    } catch (error) {
      toast.error('Algo no ha salido bien obteniendo los cursos. Intente más tarde');
    } finally {
      setLoading(false);
    }
  }, [getCourses, page]);

  const onCreateCourse = () => {
    courseRef.current = null;
    setIsEditCreateModalOpen(true);
  };

  const onEditCourse = course => {
    courseRef.current = course;
    setIsEditCreateModalOpen(true);
  };

  const onMoveCourse = async (course, operation) => {
    if (!course.orders || !course.orders[0]) return;

    try {
      await updateOrder(course.orders[0].id, {
        courseId: course.id,
        operation,
        order: course.orders[0].order,
      });
      await fetchCourses();

      toast.success('Curso movido correctamente');
    } catch (error) {
      toast.error('Algo no ha salido bien moviendo el curso. Intente más tarde');
    }
  };

  const onDeleteCourse = course => {
    courseRef.current = course;
    setIsDeleteModalOpen(true);
  };

  const onAssignCourse = course => {
    courseRef.current = course;
    setIsAssignCourseModalOpen(true);
  };

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses, page]);

  return (
    <div className="max-w-screen-2xl mx-auto">
      {loading ? (
        <div className="flex items-center justify-center flex-col gap-4 h-[700px] w-full">
          <div className={`w-10 h-10 animate-spin rounded-full border-t-2 border-b-2 border-easy-400`} />
          <p>Obteniendo cursos...</p>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-start gap-2 mt-4">
          {showCreateButton && (
            <div className="w-full sm:w-[300px] h-[360px] hover:shadow-lg transition-shadow bg-gray-300 rounded-xl cursor-pointer flex items-center justify-center" onClick={onCreateCourse}>
              <p className="font-bold text-gray-400">+ Nuevo curso</p>
            </div>
          )}

          {courses.data.map((course, index, self) => (
            <CourseCard
              isFirstChild={index === 0}
              isLastChild={index === self.length - 1}
              key={course.id}
              course={course}
              onEditCourse={onEditCourse}
              onMoveCourse={onMoveCourse}
              onDeleteCourse={onDeleteCourse}
              onAssignCourse={onAssignCourse}
            />
          ))}

          <CourseCreateEditModal isOpen={isEditCreateModalOpen} setIsOpen={setIsEditCreateModalOpen} course={courseRef.current} onSuccess={fetchCourses} />
          <AssignCourseModal isOpen={isAssignCourseModalOpen} setIsOpen={setIsAssignCourseModalOpen} course={courseRef.current} onSuccess={fetchCourses} />
          <DeleteContentModal isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen} content={courseRef.current} contentType="course" onSuccess={fetchCourses} />
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center py-5 flex-col">
        <PaginationV2 totalPages={courses.pagesCount} currentPage={Number(page)} setPage={setPage} />
        <p className="text-xs">Cursos: {courses.count}</p>
      </div>
    </div>
  );
};
