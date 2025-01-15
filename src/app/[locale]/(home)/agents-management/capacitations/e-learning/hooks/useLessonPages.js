import { useCallback } from 'react';
import { useRequest } from '../../hooks/useRequest';

export const useLessonPages = () => {
  const request = useRequest();

  const createPage = useCallback(async data => {
    return await request(`/lesson-pages`, { data, method: 'POST' });
  }, []);

  const getLessonPage = useCallback(async id => {
    return await request(`/lesson-pages/${id}`);
  }, []);

  const updatePage = useCallback(async (id, data) => {
    return await request(`/lesson-pages/${id}`, { data, method: 'PATCH' });
  }, []);

  const duplicatePage = useCallback(async id => {
    return await request(`/lesson-pages/duplicate/${id}`, { method: 'PUT' });
  }, []);

  const toggleLessonPageAsCompleted = useCallback(async (id, completed) => {
    return await request(`/lesson-pages/toggle-completed/${id}`, { method: 'PUT', data: { completed } });
  }, []);

  const deletePage = useCallback(async id => {
    return await request(`/lesson-pages/${id}`, { method: 'DELETE' });
  }, []);

  return { createPage, getLessonPage, updatePage, duplicatePage, toggleLessonPageAsCompleted, deletePage };
};
