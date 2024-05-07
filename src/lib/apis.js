'use server';
import axios from './axios';
import {
  auth,
  signIn,
  signOut
} from '../../auth';
import {
  revalidatePath,
  revalidateTag
} from 'next/cache';

export const login = async (formdata) => {
  return await signIn("credentials", formdata)
}

export const logout = async () => {
  return await signOut({
    redirectTo: "/auth"
  });
}

export const isLoggedIn = async () => {
  const session = await auth();
  return !!session?.user?.accessToken;
}

export const getLogin = async (email, password) => {
  const response = await axios().post(`/auth/login`, {
    email,
    password
  });
  return response;
}
export const getDataPassword = async (email) => {
  const response = await axios().put(`/auth/forgot-password`, {
    email
  });
  return response.data;
}
export const createContact = async (data) => {
  const response = await axios("multipart/form-data").post('/sales/crm/contacts/new', data);
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
  revalidatePath('/sales/crm/contacts', 'page');
  return response;
}

export const getAddListContacts = async () => {
  const response = await axios().get(`/sales/crm/contacts/get_add_lists`);
  return response;
}

export const getUsersContacts = async () => {
  const response = await axios().get(`/sales/crm/contacts/users`);
  return response;
}

export const createImap = async (data) => {
  const response = await axios().post(`/imap-config`, data);
  return response;
}

export const saveFolders = async (data) => {
  const response = await axios().post(`/imap-config/folder/save`, data);
  return response;
}

export const getImapConfig = async (data) => {
  const response = await axios().get(`/imap-config/${data}`);
  return response;
}

export const getFoldersSaved = async (data) => {
  const response = await axios().get(`/imap-config/folder/${data}`);
  return response;
}

export const getTasks = async (page, limit = 6) => {
  const response = await axios().get(`/tools/tasks?limit=${limit}&page=${page}`);
  return response;
}

export const deleteTask = async (id) => {
  const response = await axios().delete(`/tools/tasks/${id}`);
  revalidatePath('/tools/tasks', 'page');
  return response;
}

export const getTaskId = async (id) => {
  const response = await axios().get(`/tools/tasks/${id}`);
  return response;
}

export const postTask = async (body) => {
  const response = await axios().post(`/tools/tasks`, body);
  revalidatePath('/tools/tasks', 'page');
  return response;
}

export const putTaskId = async (id, body) => {
  const response = await axios().put(`/tools/tasks/${id}`, body);
  return response;
}

export const putTaskCompleted = async (id, body) => {
  const response = await axios().put(`/tools/tasks/${id}/completed`, body);
  return response;
}

export const getTags = async () => {
  const response = await axios().get(`/tools/tags`);
  return response;
}

export const postTags = async (body) => {
  const response = await axios().post(`/tools/tags`, body);
  return response;
}
export const putTags = async (body) => {
  const response = await axios().put(`/tools/tags/${id}`, body);
  return response;
}

export const deleteTags = async (id) => {
  const response = await axios().delete(`/tools/tags/${id}`);
  return response;
}

export const getPolizaByContact = async (id) => {
  const response = await axios().get(`/sales/crm/polizas/contact/${id}`);
  return response;
}