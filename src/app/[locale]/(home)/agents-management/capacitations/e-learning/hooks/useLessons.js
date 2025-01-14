import { useRequest } from '../../hooks/useRequest';

export const useLessons = () => {
  const request = useRequest();

  const createLesson = async data => {
    return await request(`/lessons`, { data, method: 'POST' });
  };

  const getLesson = async id => {
    return await request(`/lessons/${id}`);
  };

  const updateLesson = async (id, data) => {
    return await request(`/lessons/${id}`, { data, method: 'PATCH' });
  };

  const toggleLessonAsCompleted = async (id, completed) => {
    return await request(`/lessons/toggle-completed/${id}`, { data: { completed }, method: 'PUT' });
  };

  const deleteLesson = async id => {
    return await request(`/lessons/${id}`, { method: 'DELETE' });
  };

  return { createLesson, getLesson, updateLesson, toggleLessonAsCompleted, deleteLesson };
};
