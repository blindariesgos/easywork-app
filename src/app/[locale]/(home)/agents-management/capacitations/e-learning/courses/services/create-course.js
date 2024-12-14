import axios from 'axios';

export const createCourse = async data => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_CAPACITATIONS_HOST}/courses`, data);
  return response.data;
};
