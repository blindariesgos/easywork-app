"use server";
import axios from "axios";
import { auth } from "../../auth";
import { updateSession, clearSession } from "./session";
import { refreshAuthToken } from "./helpers/refresh_auth_token";
import { getLogger } from "@/src/utils/logger";

const logger = getLogger("axios");

const createAxiosInstance = (props) => {
  const axiosInstance = axios.create({
    baseURL: props?.baseURL ? props?.baseURL : process.env.API_HOST,
    headers: {
      "Content-Type": props?.contentType ? props?.contentType : "application/json",
    },
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      try {
        const session = await auth();
        if (session?.user?.accessToken && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${session.user.accessToken}`;
        }
        return config;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    (error) => {

      return Promise.reject(error)
    },
  );

  axiosInstance.interceptors.response.use(
    (response) => response.data,
    async (error) => {
      const originalRequest = error.config;

      if ((error.response?.status === 403 || error.response?.status === 401) && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          logger.info("Actualizando Token");
          const updatedAuthToken = await refreshAuthToken();

          if (!updatedAuthToken) {
            throw new Error("Failed to refresh auth token");
          }

          originalRequest.headers.Authorization = `Bearer ${updatedAuthToken}`;

          await updateSession(updatedAuthToken);

          return axiosInstance(originalRequest);
        } catch (tokenError) {
          console.log("@@@@ Cerrando sesion");
          await clearSession();
          throw tokenError;
        }
      }

      return Promise.reject(error.response?.data || "Unknown Error");
    },
  );

  return axiosInstance;
};

export default createAxiosInstance;
