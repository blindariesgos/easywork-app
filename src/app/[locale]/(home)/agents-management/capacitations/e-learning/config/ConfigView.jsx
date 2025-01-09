'use client';

import { getCourses } from '../courses/services/get-courses';
import CoursesGridView from '../components/CoursesGridView';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function ConfigView() {
  const [courses, setCourses] = useState([]);

  const fetchCourses = useCallback(async () => {
    try {
      const courses = await getCourses();
      setCourses(courses?.data || []);
    } catch (error) {
      toast.error('Algo no ha salido bien obteniendo los cursos. Intente más tarde');
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return <CoursesGridView courses={courses} fetchCourses={fetchCourses} showCreateButton />;
}
