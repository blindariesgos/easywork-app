import axios from 'axios';

export const getCourses = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_CAPACITATIONS_HOST}/courses`).catch(error => error);
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getCourseById = async id => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_CAPACITATIONS_HOST}/courses/${id}`).catch(error => error);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
