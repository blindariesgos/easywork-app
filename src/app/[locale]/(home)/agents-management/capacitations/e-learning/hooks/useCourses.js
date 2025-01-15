import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useRequest } from '../../hooks/useRequest';

export const useCourses = ({ fetchOnMount = true } = {}) => {
  const [courses, setCourses] = useState([]);
  const request = useRequest();

  const fetchCourses = useCallback(async () => {
    try {
      const courses = await request(`/courses`);
      setCourses(courses?.data || []);
    } catch (error) {
      toast.error('Algo no ha salido bien obteniendo los cursos. Intente más tarde');
    }
  }, [request]);

  const createCourse = async data => {
    await request(`/courses`, { data, method: 'POST' });
  };

  const updateCourse = async (id, data) => {
    await request(`/courses/${id}`, { data, method: 'PATCH' });
  };

  const deleteCourse = async id => {
    await request(`/courses/${id}`, { method: 'DELETE' });
  };

  const uploadCourseImage = async data => {
    await request(`/courses/upload-image`, { data, method: 'PUT' });
  };

  const getCourseById = async id => {
    await request(`/courses/${id}`);
  };

  useEffect(() => {
    if (fetchOnMount) fetchCourses();
  }, [fetchCourses, fetchOnMount]);

  return { courses, refetch: fetchCourses, createCourse, updateCourse, deleteCourse, uploadCourseImage, getCourseById };
};
