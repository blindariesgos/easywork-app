import axios from '../../../utils/axios';

export const createPage = async data => {
  return await axios.post(`/lesson-pages`, data);
};

export const getLessonPage = async id => {
  return await axios.get(`/lesson-pages/${id}`);
};

export const updatePage = async (id, data) => {
  return await axios.patch(`/lesson-pages/${id}`, data);
};

export const duplicatePage = async id => {
  return await axios.put(`/lesson-pages/duplicate/${id}`);
};

export const toggleLessonPageAsCompleted = async (id, completed) => {
  return await axios.put(`/lesson-pages/toggle-completed/${id}`, { completed });
};

export const deletePage = async id => {
  return await axios.delete(`/lesson-pages/${id}`);
};
