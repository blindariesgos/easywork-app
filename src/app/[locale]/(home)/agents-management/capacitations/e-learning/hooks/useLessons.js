import { useCallback } from 'react';
import { useRequest } from '../../hooks/useRequest';

export const useLessons = () => {
  const request = useRequest();

  const createLesson = useCallback(async data => {
    return await request(`/lessons`, { data, method: 'POST' });
  }, []);

  const getLesson = useCallback(async id => {
    return await request(`/lessons/${id}`);
  }, []);

  const updateLesson = useCallback(async (id, data) => {
    return await request(`/lessons/${id}`, { data, method: 'PATCH' });
  }, []);

  const toggleLessonAsCompleted = useCallback(async (id, completed) => {
    return await request(`/lessons/toggle-completed/${id}`, { data: { completed }, method: 'PUT' });
  }, []);

  const deleteLesson = useCallback(async id => {
    return await request(`/lessons/${id}`, { method: 'DELETE' });
  }, []);

  return { createLesson, getLesson, updateLesson, toggleLessonAsCompleted, deleteLesson };
};
