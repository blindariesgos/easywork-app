"use server";
import axios from "axios";
import { auth } from "../../auth";

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

  axiosInstance.interceptors.response.use(
    (response) => response.data,
    async (error) => {
      return Promise.reject(
        error?.response?.data || {
          statusCode: 500,
          message: "¡Error desconocido, intente de nuevo mas tarde!",
        }
      );
    }
  );

  return axiosInstance;
};

export default createAxiosInstance;
