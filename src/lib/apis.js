"use server";
import axios from "./axios";
import { cookies } from "next/headers";
import { auth, signIn, signOut } from "../../auth";
import { revalidatePath } from "next/cache";
import { encrypt } from "./helpers/encrypt";

export const login = async (formdata) => {
  return await signIn("credentials", formdata);
};

export const logout = async () => {
  return await signOut({
    redirectTo: "/auth",
  });
};

export const isLoggedIn = async () => {
  const session = await auth();
  return !!session?.user?.accessToken;
};

export const getLogin = async (email, password) => {
  const response = await axios().post(`/auth/login`, {
    email,
    password,
  });

  if (response && response.refreshToken) {
    const encryptedSessionData = await encrypt(response.refreshToken);

    cookies().set("refreshToken", encryptedSessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
  }

  return response;
};
export const getDataPassword = async (email) => {
  const response = await axios().put(`/auth/forgot-password`, {
    email,
  });
  return response.data;
};
export const createContact = async (data) => {
  const response = await axios("multipart/form-data").post(
    "/sales/crm/contacts/new",
    data,
  );
  // revalidatePath( '/sales/crm/contacts?page=1' ); //invalida la cache de home para que se refresque y muestre los contactos recien creados
  return response;
};
export const updateContact = async (data, id) => {
  const response = await axios().put(`/sales/crm/contacts/${id}`, data);
  return response;
};
export const updatePhotoContact = async (photo, id) => {
  const response = await axios("multipart/form-data").put(
    `/sales/crm/contacts/${id}/photo`,
    photo,
  );
  return response;
};

export const getContacts = async (page = 1) => {
  const response = await axios().get(
    `/sales/crm/contacts?limit=6&page=${page}`,
  );
  return response;
};

export const getContactId = async (id) => {
  try {
    const response = await axios().get(`/sales/crm/contacts/${id}`);
    return response;
  } catch (error) {
    // throw new Error(error);
  }
};

export const deleteContactId = async (id) => {
  // try {
  const response = await axios().delete(`/sales/crm/contacts/${id}`);
  revalidatePath("/sales/crm/contacts", "page");
  return response;
};

export const getAddListContacts = async () => {
  const response = await axios().get(`/sales/crm/contacts/get_add_lists`);
  return response;
};

export const getUsersContacts = async () => {
  const response = await axios().get(`/sales/crm/contacts/users`);
  return response;
};

export const createImap = async (data) => {
  const response = await axios().post(`/imap-config`, data);
  return response;
};

export const saveFolders = async (data) => {
  const response = await axios().post(`/imap-config/folders/save`, data);
  return response;
};

export const getImapConfig = async (data) => {
  const response = await axios().get(`/imap-config/${data}`);
  return response;
};

export const getFoldersSaved = async (data) => {
  const response = await axios().get(`/imap-config/folder/${data}`);
  return response;
};

export const getTasks = async (page = 1, limit = 6) => {
  const response = await axios().get(
    `/tools/tasks?limit=${limit}&page=${page}`,
  );
  return response;
};

export const getTasksUser = async (page = 1, limit = 6) => {
  const response = await axios().get(
    `/tools/tasks/user?limit=${limit}&page=${page}`,
  );
  return response;
};

export const deleteTask = async (id) => {
  const response = await axios().delete(`/tools/tasks/${id}`);
  return response;
};

export const getTaskId = async (id) => {
  const response = await axios().get(`/tools/tasks/${id}`);
  return response;
};

export const postTask = async (body) => {
  const response = await axios().post(`/tools/tasks`, body);
  revalidatePath("/tools/tasks", "page");
  return response;
};

export const putTaskId = async (id, body) => {

  console.log("Updating task")
  const response = await axios().put(`/tools/tasks/${id}`, body);
  return response;
};

export const putTaskCompleted = async (id) => {
  const response = await axios().put(`/tools/tasks/${id}/complete`);
  return response;
};

export const postComment = async (body, id) => {
  const response = await axios().post(`/tools/tasks/comments`, body);
  return response;
};
export const deleteComment = async (commentId, id) => {
  const response = await axios().delete(`/tools/tasks/comments/${commentId}`);
  revalidatePath(`/tools/tasks/task/${id}`, "page");
  return response;
};

export const putComment = async (commentId, body, id) => {
  console.log("Actualizando comentario", commentId, body, id);
  const response = await axios().put(
    `/tools/tasks/comments/${commentId}`,
    body,
  );
  revalidatePath(`/tools/tasks/task/${id}`, "page");
  return response;
};

export const getComments = async (taskId) => {
  const response = await axios().get(`/tools/tasks/comments/task/${taskId}`);
  return response;
};

export const getTags = async () => {
  const response = await axios().get(`/tools/tags`);
  return response;
};

export const postTags = async (body) => {
  const response = await axios().post(`/tools/tags`, body);
  return response;
};

export const putTags = async (body) => {
  const response = await axios().put(`/tools/tags/${id}`, body);
  return response;
};

export const deleteTags = async (id) => {
  const response = await axios().delete(`/tools/tags/${id}`);
  return response;
};

export const getPolizaByContact = async (id) => {
  const response = await axios().get(`/sales/crm/polizas/contact/${id}`);
  return response;
};

export const getAllLeads = async (page = 1, limit = 6) => {
  const response = await axios().get(
    `/sales/crm/leads?limit=${limit}&page=${page}`,
  );
  return response;
};
export const getLeadById = async (id) => {
  const response = await axios().get(`/sales/crm/leads/${id}`);
  return response;
};
export const postLead = async (body) => {
  const response = await axios().post(`/sales/crm/leads`, body);
  return response;
};
export const putLead = async (body) => {
  const response = await axios().put(`/sales/crm/leads/${id}`, body);
  return response;
};

export const deleteLeadById = async (id) => {
  const response = await axios().delete(`/sales/crm/leads/${id}`);
  revalidatePath("/sales/crm/leads", "page");
  return response;
};

export const googleCallback = async (data, state) => {
  const response = await axios().post(`/oauth/google-save-token`, {
    refresh_token: data.refresh_token,
    access_token: data.access_token,
    expires_in: data.expires_in,
    userId: state,
    usergoogle_id: data.usergoogle_id,
    service: 1,
    family_name: data.family_name,
    given_name: data.given_name,
    email: data.email,
    picture: data.picture,
    id_token: data.id_token,
  });
  return response;
};

export const getTokenGoogle = async (id) => {
  const response = await axios().get(`/oauth/${id}`);
  return response;
};

export const deleteTokenGoogle = async (id) => {
  const response = await axios().delete(`/oauth/${id}`);
  return response;
};

export const deleteFoldersMail = async (id) => {
  const response = await axios().delete(`/imap-config/folder/${id}`);
  return response;
};

export const postFilter = async (body) => {
  const response = await axios().post(`/easyapp/filter`, body);
  return response;
};

export const deleteFilter = async (idFilter) => {
  const response = await axios().delete(`/easyapp/filter/${idFilter}`);
  return response;
};

export const getFilters = async (idUser) => {
  const response = await axios().get(`/easyapp/filter/${idUser}`);
  return response;
};
