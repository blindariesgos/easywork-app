'use server';
import {
  revalidatePath,
  revalidateTag
} from 'next/cache';
import axios from './axios';

export const getLogin = async (email, password) => {
  const response = await axios().post(`/auth/login`, {
    email,
    password
  });
  return response.data;
}
export const getDataPassword = async (email) => {
  const response = await axios().put(`/auth/forgot-password`, {
    email
  });
  return response.data;
}
export const createContact = async (data) => {
  const response = await axios("multipart/form-data").post('/sales/crm/contacts/new', data);
  console.log("response", response)
  // revalidatePath( '/sales/crm/contacts?page=1' ); //invalida la cache de home para que se refresque y muestre los contactos recien creados
  return response
}
export const updateContact = async (data, id) => {
  const response = await axios().put(`/sales/crm/contacts/${id}`, data);
  return response
}
export const updatePhotoContact = async (photo, id) => {
  const response = await axios("multipart/form-data").put(`/sales/crm/contacts/${id}/photo`, photo);
  return response
}

export const getContacts = async (page) => {
  const response = await axios().get(`/sales/crm/contacts?limit=6&page=${page}`);
  return response;
}

export const getContactId = async (id) => {
  try {
    const response = await axios().get(`/sales/crm/contacts/${id}`);
    return response;
  } catch (error) {
    // throw new Error(error);
  }
}

export const deleteContactId = async (id) => {
  // try {    
  const response = await axios().delete(`/sales/crm/contacts/${id}`);
  // revalidateTag( '/sales/crm/contacts'); console.log("hey")
  return response;
  // } catch (error) {
  //   throw new Error(JSON.stringify(error?.response?.data));
  // }
}

export const getAddListContacts = async (id) => {
  const response = await axios().get(`/sales/crm/contacts/get_add_lists`);
  return response;
}

export const getUsersContacts = async (id) => {
  const response = await axios().get(`/sales/crm/contacts/users`);
  return response;
}