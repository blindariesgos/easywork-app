"use server";
import axios from '../axios'

export const getExplorer = async (config, filters, id) => {
    const filterQueries = Object.keys(filters).filter(key => filters[key].length > 0).map(key => `${key}=${filters[key]}`).join('&')
    const queries = Object.keys(config).map(key => `${key}=${config[key]}`).join('&')
    const url = `/folders/explorer?${queries}${id ? `&fid=${id}` : ""}${filterQueries.length > 0 ? `&${filterQueries}` : ""}`
    const response = await axios({ baseURL: process.env.API_DRIVE_HOST }).get(url).catch(error => error);
    return response;
};

export const getFolder = async (id) => {
    const response = await axios({ baseURL: process.env.API_DRIVE_HOST }).get(`/folders/${id}`).catch(error => error);
    return response;
};

export const createFolder = async (data) => {
    const response = await axios({ baseURL: process.env.API_DRIVE_HOST }).post(`/folders`, data).catch(error => error);
    return response;
};

export const updateFolder = async (id, data) => {
    const response = await axios({ baseURL: process.env.API_DRIVE_HOST }).put(`/folders/${id}`, data).catch(error => error);
    return response;
};

export const renameFolder = async (id, data) => {
    const response = await axios({ baseURL: process.env.API_DRIVE_HOST }).put(`/folders/${id}/rename`, data).catch(error => error);
    return response;
};

export const copyFolder = async (id, data, destinationId) => {
    const url = `/folders/${id}/copy${destinationId ? `?destinationId=${destinationId}` : ""}`
    const response = await axios({ baseURL: process.env.API_DRIVE_HOST }).put(url, data).catch(error => error);
    return response;
};

export const copyFile = async (id, data, destinationId) => {
    const url = `/files/${id}/copy${destinationId ? `?destinationId=${destinationId}` : ""}`
    const response = await axios({ baseURL: process.env.API_DRIVE_HOST }).put(url, data).catch(error => error);
    return response;
};

export const renameFile = async (id, data) => {
    const response = await axios({ baseURL: process.env.API_DRIVE_HOST }).put(`/files/${id}/rename`, data).catch(error => error);
    return response;
};

export const uploadFiles = async (folderId, data) => {
    const response = await axios({
        baseURL: process.env.API_DRIVE_HOST,
        contentType: "multipart/form-data"
    })
        .post(`/files/upload?folderId=${folderId}`, data).catch(error => error);
    return response;
};

