'use server';
import { revalidatePath } from 'next/cache';
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
export const createContact = async (data) => {
  console.log("data", data)
  const response = await axios.post('/sales/crm/contacts', data);
  // revalidatePath( '/sales/crm/contacts?page=1' ); //invalida la cache de home para que se refresque y muestre los contactos recien creados
  console.log(response);
  return response
}

export const getContacts = async (page) => {
  // try {    
    const response = await axios.get(`/sales/crm/contacts?limit=6&page=${page}`);  
    return response;
  // } catch (error) {
  //   return error
  // }
}

export const getContactId = async (id) => {
  try {    
    const response = await axios.get(`/sales/crm/contacts/${id}`); 
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export const deleteContactId = async (id) => {
  // try {    
    const response = await axios.delete(`/sales/crm/contacts/${id}`);
    return response;
  // } catch (error) {
  //   throw new Error(JSON.stringify(error?.response?.data));
  // }
}