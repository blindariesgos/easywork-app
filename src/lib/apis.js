import axios from './axios'; 

export const getLogin = async (email, password) => {
  const response = await axios.post(`/auth/login`,{
      email, password
  });
  return response.data;
}
export const getDataPassword = async (email) => {
  const response = await axios.put(`/auth/forgot-password`,{
      email
  });
  return response.data;
}
