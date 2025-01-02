"use server";
import axios from "axios";
import { auth } from "../../auth";
import { updateSession, clearSession } from "./session";
import { refreshAuthToken } from "./helpers/refresh_auth_token";
import { getLogger } from "@/src/utils/logger";
import { logout } from "./api/hooks/auths";

const logger = getLogger("axios");

const createAxiosInstance = (props) => {
  const axiosInstance = axios.create({
    baseURL: props?.baseURL ? props?.baseURL : process.env.API_HOST,
    headers: {
      "Content-Type": props?.contentType
        ? props?.contentType
        : "application/json",
      "x-lang": "es",
    },
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      try {
        const session = await auth();
        if (
          session?.user?.access_token &&
          (!config.headers.Authorization ||
            Date.now() > session.user.expires_at * 1000)
        ) {
          config.headers.Authorization = `Bearer ${session.user.access_token}`;
        }
        return config;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use((response) => response.data);

  return axiosInstance;
};

export const reloadSession = async (originalRequest = null) => {
  logger.info("Actualizando Token");
  const updatedAuthToken = await refreshAuthToken();

  if (!updatedAuthToken) {
    await clearSession();
    await logout();
    window.location.href = "/auth";
    throw new Error("Failed to refresh auth token");
  }
  if (originalRequest)
    originalRequest.headers.Authorization = `Bearer ${updatedAuthToken.token}`;
  await updateSession(updatedAuthToken);
};

export default createAxiosInstance;
