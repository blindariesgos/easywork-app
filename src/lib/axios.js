'use server'
import axios from "axios";
import { auth } from "../../auth";
import { logout } from "./apis";
import { cookies } from 'next/headers'

const config = axios.defaults;

const instance = (contentType = "application/json") => {
  const axiosInstance = axios.create({
    baseURL: process.env.API_HOST,
    headers: {
      ...config.headers.common,
      "Content-Type": contentType,
    },
  });

  axiosInstance.interceptors.request.use(
    (config) =>
      auth()
        .then((res) => {
          if (res?.user?.accessToken)
            config.headers.Authorization = "Bearer " + res?.user?.accessToken;
        })
        .then(() => config),
    (error) => {
      Promise.reject(error)
    }
  );

  // Data Response Interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      return response.data;
    },
    async (error) => {
      console.log("error axios", error.response.data)
      // throw new Error(error)
      if (error.response.data.statusCode == 401 || error.response.data.statusCode == 403) cookies().delete('authjs.session-token');
      return Promise.reject(JSON.stringify(error.response.data));
    }
  );

  return axiosInstance;
};

export default instance;
