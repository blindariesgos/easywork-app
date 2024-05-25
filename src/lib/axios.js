"use server";
import axios from "axios";
import { auth, signIn } from "../../auth";
import { logout } from "./apis";
import refreshAuthToken from "./helpers/refresh_auth_token";
import { cookies } from "next/headers";

const updateSessionToken = async (newAccessToken) => {
  const session = await auth();

  if (!session) return;

  const updatedSession = {
    ...session,
    user: {
      ...session.user,
      accessToken: newAccessToken,
    },
  };

  await signIn("credentials", {
    prevSession: JSON.stringify(updatedSession),
    redirect: false,
  });
};

const createAxiosInstance = (contentType = "application/json") => {
  const axiosInstance = axios.create({
    baseURL: process.env.API_HOST,
    headers: {
      "Content-Type": contentType,
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
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response.data,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const updatedAuthToken = await refreshAuthToken();

          if (!updatedAuthToken) {
            throw new Error("Failed to refresh auth token");
          }

          originalRequest.headers.Authorization = `Bearer ${updatedAuthToken}`;

          await updateSessionToken(updatedAuthToken);

          return axiosInstance(originalRequest);
        } catch (tokenError) {
          cookies().delete("authjs.session-token");
          await logout();
          // Redirige o maneja el error de manera apropiada
          throw tokenError;
        }
      }

      return Promise.reject(error.response?.data || "Unknown Error");
    }
  );

  return axiosInstance;
};

export default createAxiosInstance;
