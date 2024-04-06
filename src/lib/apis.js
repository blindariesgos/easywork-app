import axios from './axios'; 
const API = {
  getLogin: async (email, password) => {
    const response = await axios.post(`/auth/login`,{
        email, password
    });
    return response.data;
  },
  createContact: async (data) => {
    const response = await axios.post('/sales/crm/contacts', data);
    return response.message
  }
};

export default API;
