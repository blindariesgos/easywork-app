"use server";
import axios from "./axios";
import { cookies } from "next/headers";
import { auth, signIn, signOut } from "../../auth";
import { revalidatePath } from "next/cache";
import { encrypt } from "./helpers/encrypt";

const getQueries = (filters, userId) => {
  const getRepitKeys = (key, arr) => {
    const params = arr.map((item) => `${key}=${item?.id ?? item}`).join("&");
    return params;
  };

  if (Object.keys(filters).length == 0) return "";

  const getValue = (key, userId) => {
    switch (key) {
      case "role":
        return `${filters[key]}=${userId}`;
      case "deadline":
        return `${key}=${filters[key] == "undefined" ? "" : filters[key]}`;
      default:
        return `${key}=${filters[key]}`;
    }
  };

  const paramsUrl = Object.keys(filters)
    .filter((key) => typeof filters[key] !== "undefined")
    .map((key) =>
      Array.isArray(filters[key])
        ? getRepitKeys(key, filters[key])
        : getValue(key, userId)
    )
    .join("&");

  return paramsUrl;
};

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
  const response = await axios({ contentType: "multipart/form-data" })
    .post("/sales/crm/contacts/new", data)
    .catch((error) => ({ ...error, hasError: true }));
  // revalidatePath( '/sales/crm/leads' ); //invalida la cache de home para que se refresque y muestre los contactos recien creados
  return response;
};

export const createAgent = async (data) => {
  const response = await axios({ contentType: "multipart/form-data" })
    .post("/agent-management/agents", data)
    .catch((error) => ({ ...error, hasError: true }));
  revalidatePath("/agents-management/accompaniment"); //invalida la cache de home para que se refresque y muestre los contactos recien creados
  return response;
};

export const assignToDevelopmentManagerMasive = async (data) => {
  const response = await axios()
    .put("/agent-management/agents/assign-development-manager", data)
    .catch((error) => ({ ...error, hasError: true }));
  revalidatePath("/agents-management/accompaniment"); //invalida la cache de home para que se refresque y muestre los contactos recien creados
  return response;
};

export const updateAgent = async (data, agentId) => {
  const response = await axios()
    .put(`/agent-management/agents/${agentId}`, data)
    .catch((error) => ({ ...error, hasError: true }));
  revalidatePath("/agents-management/accompaniment"); //invalida la cache de home para que se refresque y muestre los contactos recien creados
  return response;
};

export const createLead = async (data) => {
  const response = await axios({ contentType: "multipart/form-data" })
    .post("/sales/crm/leads/new", data)
    .catch((error) => ({ ...error, hasError: true }));

  revalidatePath("/sales/crm/leads", "layout");
  return response;
};

export const createSimpleLeadLanding = async (data) => {
  const response = await axios()
    .post("/sales/crm/leads/landing/new", data)
    .catch((error) => ({ ...error, hasError: true }));
  return response;
};

export const updateLead = async (data, id) => {
  const response = await axios({ contentType: "multipart/form-data" })
    .put(`/sales/crm/leads/${id}`, data)
    .catch((error) => ({ ...error, hasError: true }));
  revalidatePath("/sales/crm/leads", "layout");
  return response;
};
export const updateContact = async (data, id) => {
  const response = await axios({ contentType: "multipart/form-data" })
    .put(`/sales/crm/contacts/${id}`, data)
    .catch((error) => ({ ...error, hasError: true }));
  return response;
};
export const updatePhotoContact = async (photo, id) => {
  const response = await axios({ contentType: "multipart/form-data" })
    .put(`/sales/crm/contacts/${id}/photo`, photo)
    .catch((error) => ({ ...error, hasError: true }));

  return response;
};

export const getContacts = async (page = 1) => {
  const response = await axios().get(
    `/sales/crm/contacts?limit=6&page=${page}`
  );
  return response;
};

export const getContactId = async (id) => {
  try {
    const response = await axios()
      .get(`/sales/crm/contacts/${id}`)
      .catch((error) => ({ hasError: true, ...error }));
    return response;
  } catch (error) {
    // throw new Error(error);
  }
};

export const getReceiptKanbanByStateId = async (params) => {
  try {
    const queries = getQueries(params);
    const url = `/sales/crm/polizas/receipts/kanban?${queries}`;
    console.log(url);
    const response = await axios()
      .get(url)
      .catch((error) => ({ hasError: true, ...error }));
    return response;
  } catch (error) {}
};

export const getPolicyById = async (id) => {
  try {
    const response = await axios().get(`/sales/crm/polizas/${id}`);
    return response;
  } catch (error) {
    // throw new Error(error);
  }
};

export const deleteContactId = async (id) => {
  // try {
  const response = await axios().delete(`/sales/crm/contacts/${id}`);
  revalidatePath("/sales/crm/contacts", "layout");
  return response;
};

export const deletePolicyById = async (id) => {
  // try {
  const response = await axios().delete(`/sales/crm/polizas/${id}`);
  revalidatePath("/operations/policies", "layout");
  return response;
};
export const deleteAgentById = async (agentId) => {
  // try {
  const response = await axios().delete(`/agent-management/agents/${agentId}`);
  return response;
};

export const deleteReceiptById = async (receiptId) => {
  // try {
  const response = await axios().delete(
    `/sales/crm/polizas/receipts/${receiptId}`
  );
  revalidatePath("/control/portafolio/receipts", "page");
  return response;
};

export const getAddListContacts = async () => {
  const response = await axios().get(`/sales/crm/contacts/get_add_lists`);
  return response;
};

export const getPortafolioControlResume = async ({ filters }) => {
  const queries = getQueries(filters);
  const response = await axios()
    .get(`/sales/crm/polizas/receipts/collection_report/header?${queries}`)
    .catch((error) => ({ hasError: true, error }));
  return response;
};

export const getAddListLeads = async () => {
  const response = await axios().get(`/sales/crm/leads/get_add_lists`);
  return response;
};

export const getAddListReceipts = async () => {
  const response = await axios().get(
    `/sales/crm/polizas/receipts/get_add_lists`
  );
  return response;
};

export const getAddListPolicies = async () => {
  const response = await axios().get(`/sales/crm/polizas/get_add_lists`);
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
    `/tools/tasks?limit=${limit}&page=${page}`
  );
  return response;
};

export const getTasksUser = async (page = 1, limit = 6) => {
  const response = await axios().get(
    `/tools/tasks/user?limit=${limit}&page=${page}`
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
export const postMeet = async (body) => {
  const response = await axios().post(`/agent-management/meetings`, body);
  // revalidatePath("/tools/tasks", "page");
  return response;
};
export const putTaskId = async (id, body) => {
  console.log("Updating task");
  const response = await axios()
    .put(`/tools/tasks/${id}`, body)
    .catch((error) => ({ hasError: true, error }));
  revalidatePath(`/tools/tasks/task/${id}`, "page");
  revalidatePath(`/tools/tasks`, "layout");

  return response;
};

export const putMeetById = async (meetingId, body) => {
  console.log("Updating meet");
  const response = await axios()
    .put(`/agent-management/meetings/${meetingId}`, body)
    .catch((error) => ({ hasError: true, error }));
  // revalidatePath(`/tools/tasks/task/${id}`, "page");
  // revalidatePath(`/tools/tasks`, "layout");

  return response;
};

export const deleteFileTaskById = async (taskId, body) => {
  console.log("Deleting task file", taskId, body);
  const response = await axios()
    .delete(`/tools/tasks/${taskId}/attachments`, { data: body })
    .catch((error) => ({ hasError: true, error }));
  revalidatePath(`/tools/tasks/task/${taskId}`, "page");
  revalidatePath(`/tools/tasks`, "layout");

  return response;
};

export const deleteFileMeetById = async (meetingId, body) => {
  console.log("Deleting meet file", meetingId, body);
  const response = await axios()
    .delete(`/agent-management/meetings/${meetingId}/attachments`, {
      data: body,
    })
    .catch((error) => ({ hasError: true, error }));
  revalidatePath(
    `/agents-management/meetings-and-sessions/teams/meet/${meetingId}`,
    "page"
  );
  return response;
};

export const putTaskIdRelations = async (taskId, body) => {
  console.log("Updating task relations");
  const response = await axios().put(
    `/tools/tasks/${taskId}/update_relations`,
    body
  );
  return response;
};

export const putTaskCompleted = async (id) => {
  const response = await axios().put(`/tools/tasks/${id}/complete`);
  return response;
};

export const putTaskRestart = async (id) => {
  const response = await axios().put(`/tools/tasks/${id}/continue`);
  return response;
};

export const convertToSubtaskOf = async (taskId, parentId) => {
  const response = await axios().put(
    `/tools/tasks/${taskId}/convert_to_subtask_of/${parentId}`
  );
  return response;
};

export const postComment = async (body, id) => {
  const response = await axios().post(`/tools/tasks/comments`, body);
  return response;
};
export const postMeetComment = async (body) => {
  const response = await axios().post(
    `/agent-management/meetings/comments`,
    body
  );
  return response;
};

export const putLeadStage = async (leadId, stageId) => {
  const response = await axios()
    .put(`/sales/crm/leads/${leadId}/stage/${stageId}`)
    .catch((error) => ({ hasError: true, ...error }));
  return response;
};

export const putLeadCancelled = async (leadId, body) => {
  const response = await axios()
    .put(`/sales/crm/leads/${leadId}/cancel`, body)
    .catch((error) => ({ hasError: true, ...error }));
  return response;
};

export const deleteComment = async (commentId, id) => {
  const response = await axios().delete(`/tools/tasks/comments/${commentId}`);
  revalidatePath(`/tools/tasks/task/${id}`, "page");
  return response;
};

export const deleteMeetComment = async (commentId) => {
  const response = await axios().delete(
    `/agent-management/meetings/comments/${commentId}`
  );
  return response;
};

export const putComment = async (commentId, body, taskId) => {
  console.log("Actualizando comentario", commentId, body, taskId);
  const response = await axios().put(
    `/tools/tasks/comments/${commentId}`,
    body
  );
  revalidatePath(`/tools/tasks/task/${taskId}`, "page");
  return response;
};

export const putMeetComment = async (commentId, body, meetId) => {
  console.log("Actualizando comentario", commentId, body, meetId);
  const response = await axios().put(
    `/agent-management/meetings/comments/${commentId}`,
    body
  );
  revalidatePath(`/tools/tasks/task/${meetId}`, "page");
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

export const postSubAgent = async (body) => {
  const response = await axios()
    .put(`/sales/crm/polizas/receipts/sub-agents`, body)
    .catch((error) => ({ hasError: true, ...error }));
  return response;
};

export const deleteSubAgent = async (subAgentId) => {
  const response = await axios().delete(
    `/sales/crm/polizas/receipts/sub-agents/${subAgentId}`
  );
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

export const putPoliza = async (policyId, body) => {
  const response = await axios()
    .put(`/sales/crm/polizas/${policyId}`, body)
    .catch((error) => ({ hasError: true, ...error }));

  revalidatePath(`/operations/policies/policy/${policyId}?show=true`, "page");

  return response;
};

export const putReceipt = async (receiptId, body) => {
  const response = await axios()
    .put(`/sales/crm/polizas/receipts/${receiptId}`, body)
    .catch((error) => ({ hasError: true, ...error }));
  return response;
};

export const getLeadById = async (id) => {
  const response = await axios().get(`/sales/crm/leads/${id}`);
  return response;
};

export const getReceiptById = async (receiptId) => {
  const response = await axios().get(
    `/sales/crm/polizas/receipts/${receiptId}`
  );
  return response;
};

export const getAgentById = async (agentId) => {
  const response = await axios().get(`/agent-management/agents/${agentId}`);
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
    service: data.service,
    family_name: data.family_name,
    given_name: data.given_name,
    email: data.email,
    picture: data.picture,
    id_token: data.id_token,
  });
  return response;
};

export const createEmailConfig = async (data) => {
  const response = await axios().post(`/oauth/emailconfig`, data);
  return response;
};

export const getEmailConfig = async (email) => {
  const response = await axios().get(`/oauth/emailconfig/${email}`);
  return response;
};

export const updateEmailConfig = async (data) => {
  const response = await axios().put(`/oauth/emailconfig`, data);
  return response;
};

export const updateStatus = async (data) => {
  const response = await axios().put(`/users/status`, {
    status: data,
  });
  return response;
};

export const getTokenGoogle = async (userId, oauthId) => {
  const response = await axios().get(`/oauth/config/${userId}/${oauthId}`);
  return response;
};

export const deleteTokenGoogle = async (
  userId,
  oauthId,
  refreshtoken,
  fromCalendar
) => {
  const response = await axios().delete(
    `/oauth/${userId}/${oauthId}?refreshtoken=${refreshtoken}&fromCalendar=${fromCalendar}`
  );
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

export const getMails = async (idUser, page, perPage, folder, oauthId) => {
  const response = await axios().get(
    `/oauth/email/${idUser}/${oauthId}?page=${page}&perPage=${perPage}&folder=${folder}`
  );
  return response;
};

export const getAllOauth = async (idUser, service) => {
  const response = await axios().get(`/oauth/all/${idUser}?service=${service}`);
  return response;
};

export const deleteMails = async (idUser) => {
  const response = await axios().delete(`/oauth/email/delete${idUser}`);
  return response;
};

export const updateLabelId = async (usergoogle_id, newLabelId) => {
  const response = await axios().put(`/oauth/labelId`, {
    usergoogle_id,
    newLabelId,
  });
  return response;
};

export const updateLabelIdRules = async (usergoogle_id, newLabelIdRules) => {
  const response = await axios().put(`/oauth/labelIdRules`, {
    usergoogle_id,
    newLabelIdRules,
  });
  return response;
};

const getCommentPath = (cmrtype) => {
  switch (cmrtype) {
    case "policy":
    case "renewal":
      return "/sales/crm/polizas";
    case "lead":
      return "/sales/crm/leads";
    case "agent":
      return "/agent-management/agents";
    case "receipt":
      return "/sales/crm/polizas/receipts";
    default:
      return "/sales/crm/contacts";
  }
};
export const addContactComment = async (body, cmrType) => {
  const url = `${getCommentPath(cmrType)}/comments`;
  console.log(url, body);
  const response = await axios().post(url, body);
  return response;
};

export const getAllRoles = async () => {
  const response = await axios().get(`/roles`);
  return response;
};

export const updateUser = async (id, body) => {
  const response = await axios({ contentType: "multipart/form-data" })
    .put(`/users/${id}`, body)
    .catch((error) => ({ ...error, hasError: true }));
  return response;
};

export const getUserById = async (id) => {
  const response = await axios()
    .get(`/users/${id}`)
    .catch((error) => ({ ...error, hasError: true }));
  return response;
};

export const addCalendarEvent = async (body) => {
  const response = await axios()
    .post(`/calendar/events`, body)
    .catch((error) => ({ ...error, hasError: true }));
  return response;
};

export const updateCalendarEvent = async (body, eventId) => {
  const response = await axios()
    .put(`/calendar/events/${eventId}`, body)
    .catch((error) => ({ ...error, hasError: true }));
  return response;
};

export const deleteCalendarEvent = async (eventId, userId, oauthId) => {
  const response = await axios()
    .delete(`/calendar/events/${eventId}?userId=${userId}&oauthId=${oauthId}`)
    .catch((error) => ({ ...error, hasError: true }));
  return response;
};

export const getContactsNeedAttention = async () => {
  const response = await axios().get(`/tools/tasks/home/lists/contacts`);
  return response;
};

export const getPoliciesNeedAttention = async () => {
  const response = await axios().get(`/tools/tasks/home/lists/polizas`);
  return response;
};

export const addReceiptDocument = async (receiptId, category, body) => {
  const response = await axios({ contentType: "multipart/form-data" })
    .post(
      `/sales/crm/polizas/receipts/upload/${receiptId}?category=${category}`,
      body
    )
    .catch((error) => ({ ...error, hasError: true }));
  return response;
};

export const addLeadDocument = async (leadId, category, body) => {
  const response = await axios({ contentType: "multipart/form-data" })
    .post(`/sales/crm/leads/upload/${leadId}?category=${category}`, body)
    .catch((error) => ({ ...error, hasError: true }));
  return response;
};

export const addPolicyByPdf = async (body, category = "nueva") => {
  const response = await axios()
    .post(`/operations/management/poliza/new?category=${category}`, body)
    .catch((error) => ({ error, hasError: true }));
  return response;
};

export const addRefund = async (body) => {
  const response = await axios({ contentType: "multipart/form-data" })
    .post(`/operations/management/reimbursement`, body)
    .catch((error) => ({ ...error, hasError: true }));
  return response;
};

export const addSchedule = async (body) => {
  const response = await axios({ contentType: "multipart/form-data" })
    .post(`/operations/management/scheduling`, body)
    .catch((error) => ({ ...error, hasError: true }));
  return response;
};

export const addRenovationByPdf = async (body) => {
  const response = await axios({ contentType: "multipart/form-data" })
    .post(`/operations/management/renewal/pdf`, body)
    .catch((error) => ({ error, hasError: true }));
  return response;
};

export const getMetadataOfPdf = async (category, body) => {
  const response = await axios({ contentType: "multipart/form-data" })
    .post(`/operations/management/metadata/pdf?category=${category}`, body)
    .catch((error) => ({ error, hasError: true }));
  return response;
};

export const addContactDocument = async (contactId, category, body) => {
  const response = await axios({ contentType: "multipart/form-data" })
    .post(`/sales/crm/contacts/upload/${contactId}?category=${category}`, body)
    .catch((error) => ({ ...error, hasError: true }));
  return response;
};

export const postPositiveStagePolicy = async (leadId) => {
  const response = await axios()
    .post(`/sales/crm/leads/${leadId}/generate_poliza`)
    .catch((error) => ({ ...error, hasError: true }));
  return response;
};

export const getPolizaLeadData = async (leadId) => {
  const response = await axios()
    .get(`/v1/sales/crm/leads/${leadId}/get_poliza_data`)
    .catch((error) => ({ ...error, hasError: true }));
  return response;
};

export const getUsersGroup = async (idUser) => {
  const response = await axios().get(`/users/group/${idUser}`);
  return response;
};
export const getAllTasks = async ({
  filters = {},
  userId = "",
  config = {},
}) => {
  const queries = getQueries(filters, userId);
  const configParams = Object.keys(config)
    .map((key) => `${key}=${config[key]}`)
    .join("&");
  const url = `/tools/tasks/user?${configParams}${queries.length > 0 ? `&${queries}` : ""}`;
  console.log(url);
  const response = await axios()
    .get(url)
    .catch((error) => ({ hasError: true, error }));
  return response;
};

export const getAllPolicies = async ({
  filters = {},
  config = {},
  userId = "",
}) => {
  const queries = getQueries(filters, userId);
  const configParams = Object.keys(config)
    .map((key) => `${key}=${config[key]}`)
    .join("&");
  const url = `/sales/crm/polizas?${configParams}${queries.length > 0 ? `&${queries}` : ""}`;
  console.log(url);
  const response = await axios()
    .get(url)
    .catch((error) => ({ hasError: true, error }));
  return response;
};

export const getKanbanLeads = async ({ config = {}, filters = {} }) => {
  const queries = getQueries(filters);
  const configParams = Object.keys(config)
    .map((key) => `${key}=${config[key]}`)
    .join("&");
  const url = `/sales/crm/leads/kanban?${configParams}${queries.length > 0 ? `&${queries}` : ""}`;
  console.log({ url });
  const response = await axios()
    .get(url)
    .catch((error) => ({ hasError: true, error }));
  return response;
};

export const getLeadCancelReazon = async () => {
  const url = `/sales/crm/leads/cancel-reazon`;
  const response = await axios()
    .get(url)
    .then((items) => ({ data: items }))
    .catch((error) => ({ hasError: true, error }));
  return response;
};

export const getMeetById = async (id) => {
  const response = await axios()
    .get(`/agent-management/meetings/${id}`)
    .catch((error) => ({ hasError: true, error }));
  return response;
};
