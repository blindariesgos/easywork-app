import axios from 'axios';

export const createLesson = async data => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_CAPACITATIONS_HOST}/lessons`, data);
  return response.data;
};

export const updateLesson = async (id, data) => {
  const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_CAPACITATIONS_HOST}/lessons/${id}`, data);
  return response.data;
};

export const deleteLesson = async id => {
  const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_CAPACITATIONS_HOST}/lessons/${id}`);
  return response.data;
};
