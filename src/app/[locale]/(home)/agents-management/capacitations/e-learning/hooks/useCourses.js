import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useRequest } from '../../hooks/useRequest';

export const useCourses = ({ fetchOnMount = true } = {}) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const request = useRequest();

  const fetchCourses = useCallback(async () => {
    setLoading(true);

    try {
      const courses = await request(`/courses`);
      setCourses(courses?.data || []);
    } catch (error) {
      toast.error('Algo no ha salido bien obteniendo los cursos. Intente más tarde');
    } finally {
      setLoading(false);
    }
  }, [request]);

  const createCourse = useCallback(async data => {
    return await request(`/courses`, { data, method: 'POST' });
  }, []);

  const updateCourse = useCallback(async (id, data) => {
    return await request(`/courses/${id}`, { data, method: 'PATCH' });
  }, []);

  const deleteCourse = useCallback(async id => {
    return await request(`/courses/${id}`, { method: 'DELETE' });
  }, []);

  const uploadCourseImage = useCallback(async data => {
    return await request(`/courses/upload-image`, { data, method: 'PUT' });
  }, []);

  const getCourseById = useCallback(async id => {
    return await request(`/courses/${id}`);
  }, []);

  useEffect(() => {
    if (fetchOnMount) fetchCourses();
  }, [fetchCourses, fetchOnMount]);

  return { courses, refetch: fetchCourses, createCourse, updateCourse, deleteCourse, uploadCourseImage, getCourseById, loading };
};
