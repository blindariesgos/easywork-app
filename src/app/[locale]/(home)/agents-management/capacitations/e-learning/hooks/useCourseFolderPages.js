import { useCallback } from 'react';
import { useRequest } from '../../hooks/useRequest';

export const useCourseFolderPages = () => {
  const request = useRequest();

  const createCourseFolderPage = useCallback(
    async (data, options = {}) => {
      return await request(`/course-folder-pages`, { data, method: 'POST', ...options });
    },
    [request]
  );

  const getCourseFolderPage = useCallback(
    async (id, options = {}) => {
      return await request(`/course-folder-pages/${id}`, options);
    },
    [request]
  );

  const updateCourseFolderPage = useCallback(
    async (id, data, options = {}) => {
      return await request(`/course-folder-pages/${id}`, { data, method: 'PATCH', ...options });
    },
    [request]
  );

  const duplicateCourseFolderPage = useCallback(
    async (id, options = {}) => {
      return await request(`/course-folder-pages/duplicate/${id}`, { method: 'PUT', ...options });
    },
    [request]
  );

  const changeFolderPage = useCallback(
    async (id, data, options = {}) => {
      return await request(`/course-folder-pages/change-folder/${id}`, { method: 'PUT', data, ...options });
    },
    [request]
  );

  const toggleCourseFolderPageAsCompleted = useCallback(
    async (id, completed, options = {}) => {
      return await request(`/course-folder-pages/toggle-completed/${id}`, { method: 'PUT', data: { completed }, ...options });
    },
    [request]
  );

  const deleteCourseFolderPage = useCallback(
    async (id, options = {}) => {
      return await request(`/course-folder-pages/${id}`, { method: 'DELETE', ...options });
    },
    [request]
  );

  return { createCourseFolderPage, getCourseFolderPage, updateCourseFolderPage, duplicateCourseFolderPage, changeFolderPage, toggleCourseFolderPageAsCompleted, deleteCourseFolderPage };
};
