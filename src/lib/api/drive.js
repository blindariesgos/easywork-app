"use server";
import axios from '../axios'

export const getFolders = async () => {
    const response = await axios({ baseURL: process.env.API_DRIVE_HOST }).get(`/folders`);
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
    const response = await axios({ baseURL: process.env.API_DRIVE_HOST }).put(url, data);
    return response;
};

