import { useCallback } from 'react';

import { useRequest } from '../../hooks/useRequest';

export const useCourses = () => {
  const request = useRequest();

  const getCourses = useCallback(
    async (options = {}) => {
      return await request(`/courses`, options);
    },
    [request]
  );

  const createCourse = useCallback(
    async (data, options = {}) => {
      return await request(`/courses`, { data, method: 'POST', ...options });
    },
    [request]
  );

  const updateCourse = useCallback(
    async (id, data, options = {}) => {
      return await request(`/courses/${id}`, { data, method: 'PATCH', ...options });
    },
    [request]
  );

  const deleteCourse = useCallback(
    async (id, options = {}) => {
      return await request(`/courses/${id}`, { method: 'DELETE', ...options });
    },
    [request]
  );

  const uploadCourseImage = useCallback(
    async (data, options = {}) => {
      return await request(`/courses/upload-image`, { data, method: 'POST', ...options });
    },
    [request]
  );

  const getCourseById = useCallback(
    async (id, options = {}) => {
      return await request(`/courses/${id}`, options);
    },
    [request]
  );

  return { getCourses, createCourse, updateCourse, deleteCourse, uploadCourseImage, getCourseById };
};
