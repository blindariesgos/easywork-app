import { useRequest } from '../../hooks/useRequest';

export const useLessonPages = () => {
  const request = useRequest();

  const createPage = async data => {
    return await request(`/lesson-pages`, { data, method: 'POST' });
  };

  const getLessonPage = async id => {
    return await request(`/lesson-pages/${id}`);
  };

  const updatePage = async (id, data) => {
    return await request(`/lesson-pages/${id}`, { data, method: 'PATCH' });
  };

  const duplicatePage = async id => {
    return await request(`/lesson-pages/duplicate/${id}`, { method: 'PUT' });
  };

  const toggleLessonPageAsCompleted = async (id, completed) => {
    return await request(`/lesson-pages/toggle-completed/${id}`, { method: 'PUT', data: { completed } });
  };

  const deletePage = async id => {
    return await request(`/lesson-pages/${id}`, { method: 'DELETE' });
  };

  return { createPage, getLessonPage, updatePage, duplicatePage, toggleLessonPageAsCompleted, deletePage };
};
