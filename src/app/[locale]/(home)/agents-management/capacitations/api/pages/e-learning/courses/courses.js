import axios from '../../../utils/axios';

export const createCourse = async data => {
  return await axios.post(`/courses`, data);
};

export const updateCourse = async (id, data) => {
  return await axios.patch(`/courses/${id}`, data);
};

export const deleteCourse = async id => {
  return await axios.delete(`/courses/${id}`);
};

export const uploadCourseImage = async data => {
  return await axios.post(`/courses/upload-image`, data);
};

export const getCourses = async () => {
  return await axios.get(`/courses`);
};

export const getCourseById = async id => {
  return await axios.get(`/courses/${id}`);
};
