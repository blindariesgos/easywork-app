import { useCallback } from 'react';
import { useRequest } from '../../hooks/useRequest';

export const useCourseFolders = () => {
  const request = useRequest();

  const createCourseFolder = useCallback(
    async (data, options = {}) => {
      return await request(`/course-folders`, { data, method: 'POST', ...options });
    },
    [request]
  );

  const getCourseFolder = useCallback(
    async (id, options = {}) => {
      return await request(`/course-folders/${id}`, options);
    },
    [request]
  );

  const updateCourseFolder = useCallback(
    async (id, data, options = {}) => {
      return await request(`/course-folders/${id}`, { data, method: 'PATCH', ...options });
    },
    [request]
  );

  const deleteCourseFolder = useCallback(
    async (id, options = {}) => {
      return await request(`/course-folders/${id}`, { method: 'DELETE', ...options });
    },
    [request]
  );

  return { createCourseFolder, getCourseFolder, updateCourseFolder, deleteCourseFolder };
};
