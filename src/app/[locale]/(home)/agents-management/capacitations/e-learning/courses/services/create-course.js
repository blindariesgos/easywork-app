import axios from 'axios';

export const createCourse = async data => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_CAPACITATIONS_HOST}/courses`, data);
  return response.data;
};

export const updateCourse = async (id, data) => {
  const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_CAPACITATIONS_HOST}/courses/${id}`, data);
  return response.data;
};

export const deleteCourse = async id => {
  const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_CAPACITATIONS_HOST}/courses/${id}`);
  return response.data;
};
