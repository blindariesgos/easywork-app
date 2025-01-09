import axios from 'axios';

export const createPage = async data => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_CAPACITATIONS_HOST}/lesson-pages`, data);
  return response.data;
};

export const getLessonPage = async id => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_CAPACITATIONS_HOST}/lesson-pages/${id}`);
  return response.data;
};

export const updatePage = async (id, data) => {
  const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_CAPACITATIONS_HOST}/lesson-pages/${id}`, data);
  return response.data;
};

export const duplicatePage = async id => {
  const response = await axios.put(`${process.env.NEXT_PUBLIC_API_CAPACITATIONS_HOST}/lesson-pages/duplicate/${id}`);
  return response.data;
};

export const toggleLessonPageAsCompleted = async (id, completed) => {
  const response = await axios.put(`${process.env.NEXT_PUBLIC_API_CAPACITATIONS_HOST}/lesson-pages/toggle-completed/${id}`, { completed });
  return response.data;
};

export const deletePage = async id => {
  const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_CAPACITATIONS_HOST}/lesson-pages/${id}`);
  return response.data;
};
