"use server";
import axios from '../axios'

export const getExplorer = async (config, id) => {
    const queries = Object.keys(config).map(key => `${key}=${config[key]}`).join('&')
    const url = `/folders/explorer?${queries}${id ? `&fid=${id}` : ""}`
    const response = await axios({ baseURL: process.env.API_DRIVE_HOST }).get(url).catch(error => error);
    return response;
};

export const getFolder = async (id) => {
    const response = await axios({ baseURL: process.env.API_DRIVE_HOST }).get(`/folders/${id}`);
    return response;
};

export const createFolder = async (data) => {
    const response = await axios({ baseURL: process.env.API_DRIVE_HOST }).post(`/folders`, data);
    return response;
};

export const updateFolder = async (id, data) => {
    const response = await axios({ baseURL: process.env.API_DRIVE_HOST }).put(`/folders/${id}`, data);
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

export const uploadFiles = async (folderId, data) => {
    const response = await axios({
        baseURL: process.env.API_DRIVE_HOST,
        contentType: "multipart/form-data"
    })
        .post(`/files/upload?folderId=${folderId}`, data).catch(error => error);
    return response;
};

