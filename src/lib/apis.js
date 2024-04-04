import axios from './axios'; 
const API = {
  getLogin: async (email, password) => {
    const response = await axios.post(`/auth/login`,{
        email, password
    });
    return response.data;
  }
};

export default API;
