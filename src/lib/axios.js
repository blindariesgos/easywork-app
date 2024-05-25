'use server'
import axios from "axios";
import { auth } from "../../auth";
import { logout } from "./apis";
import { cookies } from 'next/headers'
import refreshAuthToken from "./helpers/refres_auth_token"

const config = axios.defaults;

const instance = (contentType = "application/json") => {
  const axiosInstance = axios.create({
    baseURL: process.env.API_HOST,
    headers: {
      ...config.headers.common,
      "Content-Type": contentType,
    },
  });

  // Request Interceptor para agregar token
  axiosInstance.interceptors.request.use(
    async (config) => {
      try {
        const res = await auth();
        if (res?.user?.accessToken) {
          config.headers.Authorization = "Bearer " + res.user.accessToken;
        }

        return config;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    (error) => {
      Promise.reject(error)
    }
  );

  // Data Response Interceptor
  axiosInstance.interceptors.response.use(
    (response) => response.data,
    async (error) => {
      const originalRequest = error.config;
      console.log("error axios", error.response?.data)

      // throw new Error(error)
        console.log(originalRequest._retry)
        if ((error.response?.status === 401) && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // Intenta obtener un nuevo token
          const updatedAuthToken = await refreshAuthToken();  // Implementa esta función para renovar token
          originalRequest.headers.Authorization = "Bearer " + updatedAuthToken;
          console.log("Estoy aquiii", originalRequest)
          return axios(originalRequest);  // Reintenta la solicitud original con el nuevo token
        } catch (error) {
          // Si falla la renovación del token, borra la sesión y desloguea
          cookies().delete('authjs.session-token');
          logout();  // Asegúrate que la función logout maneje el cierre de sesión correctamente
          return Promise.reject(error);
        }
      }

      return Promise.reject(error.response?.data || 'Unknown Error');

    }
  );

  return axiosInstance;
};

export default instance;
