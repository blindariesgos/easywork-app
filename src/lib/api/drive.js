"use server";
import axios from '../axios'

export const getExplorer = async (config, filters, id) => {
    const filterQueries = Object.keys(filters).filter(key => filters[key].length > 0).map(key => `${key}=${filters[key]}`).join('&')
    const queries = Object.keys(config).map(key => `${key}=${config[key]}`).join('&')
    const url = `/folders/explorer?${queries}${id ? `&fid=${id}` : ""}${filterQueries.length > 0 ? `&${filterQueries}` : ""}`
    console.log({ url })
    const response = await axios({ baseURL: process.env.NEXT_PUBLIC_API_DRIVE_HOST }).get(url).catch(error => error);
    return response;
};

export const getFolder = async (id) => {
    const response = await axios({ baseURL: process.env.NEXT_PUBLIC_API_DRIVE_HOST }).get(`/folders/${id}`).catch(error => error);
    return response;
};

export const getFoldersByContact = async (id) => {
    const response = await axios({ baseURL: process.env.NEXT_PUBLIC_API_DRIVE_HOST }).get(`/folders/by-contact/${id}`).catch(error => error);
    return response;
};

export const createFolder = async (data) => {
    const response = await axios({ baseURL: process.env.NEXT_PUBLIC_API_DRIVE_HOST }).post(`/folders`, data).catch(error => error);
    return response;
};

export const updateFolder = async (id, data) => {
    const response = await axios({ baseURL: process.env.NEXT_PUBLIC_API_DRIVE_HOST }).put(`/folders/${id}`, data).catch(error => error);
    return response;
};

export const renameFolder = async (id, data) => {
    const response = await axios({ baseURL: process.env.NEXT_PUBLIC_API_DRIVE_HOST }).put(`/folders/${id}/rename`, data).catch(error => error);
    return response;
};

export const copyItem = async (itemType, id, data, destinationId) => {
    const url = `/${itemType}/${id}/copy${destinationId ? `?destinationId=${destinationId}` : ""}`
    const response = await axios({ baseURL: process.env.NEXT_PUBLIC_API_DRIVE_HOST }).put(url, data).catch(error => error);
    return response;
};

export const moveItem = async (itemType, id, destinationId) => {
    const url = `/${itemType}/${id}/move${destinationId ? `?destinationId=${destinationId}` : ""}`
    const response = await axios({ baseURL: process.env.NEXT_PUBLIC_API_DRIVE_HOST }).put(url).catch(error => error);
    return response;
};

export const renameFile = async (id, data) => {
    const response = await axios({ baseURL: process.env.NEXT_PUBLIC_API_DRIVE_HOST }).put(`/files/${id}/rename`, data).catch(error => error);
    return response;
};

export const uploadFiles = async (folderId, data) => {
    const response = await axios({
        baseURL: process.env.NEXT_PUBLIC_API_DRIVE_HOST,
        contentType: "multipart/form-data"
    })
        .post(`/files/upload?folderId=${folderId}`, data).catch(error => error);
    return response;
};

export const deleteItem = async (type, id) => {
    const url = `/${type}/${id}`
    const response = await axios({ baseURL: process.env.NEXT_PUBLIC_API_DRIVE_HOST }).delete(url).catch(error => error);
    return response;
};

export const assignCRMContact = async (folderId, contactId) => {
    const url = `/folders/${folderId}/assign-crm-contact/${contactId}`
    const response = await axios({ baseURL: process.env.NEXT_PUBLIC_API_DRIVE_HOST }).put(url).catch(error => error);
    return response;
};

export const getUserSignatures = async () => {
    const response = await axios({ baseURL: process.env.NEXT_PUBLIC_API_DRIVE_HOST }).get(`/files/signatures`).catch(error => error);
    return response;
};

export const deleteUserSignatures = async (id) => {
    const response = await axios({baseURL: process.env.NEXT_PUBLIC_API_DRIVE_HOST}).delete(`/files/signatures/${id}`).catch(error => error);
    return response;
};

export const postUserSignatures = async (formData) => {
    console.log(formData);
    const response = await axios({ baseURL: process.env.NEXT_PUBLIC_API_DRIVE_HOST, contentType: "multipart/form-data" }).post(`/files/signatures`, formData).catch(error => error);
    return response;
};

export const putUserSignatures = async (metadata, edit) => {
    const response = await axios({ baseURL: process.env.NEXT_PUBLIC_API_DRIVE_HOST }).put(`/files/signatures/${edit}/metadata`, { metadata }).catch(error => error);
    return response;
};

export const getUserSignature = async (edit) => {
    console.log(edit);
    const response = await axios({ baseURL: process.env.NEXT_PUBLIC_API_DRIVE_HOST }).get(`/files/signatures/${edit}`).catch(error => error);
    console.log(response);
    return response;
};