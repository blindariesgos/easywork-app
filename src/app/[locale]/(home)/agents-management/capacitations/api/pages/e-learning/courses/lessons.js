import axios from '../../../utils/axios';

export const createLesson = async data => {
  return await axios.post(`/lessons`, data);
};

export const getLesson = async id => {
  return await axios.get(`/lessons/${id}`);
};

export const updateLesson = async (id, data) => {
  return await axios.patch(`/lessons/${id}`, data);
};

export const toggleLessonAsCompleted = async (id, completed) => {
  return await axios.put(`/lessons/toggle-completed/${id}`, { completed });
};

export const deleteLesson = async id => {
  return await axios.delete(`/lessons/${id}`);
};
