import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { getCourses } from '../../api/pages/e-learning/courses/courses';

export const useCourses = () => {
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

  return { courses, refetch: fetchCourses };
};
