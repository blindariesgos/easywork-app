import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useCallback } from 'react';

const axiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_CAPACITATIONS_HOST });

export const useRequest = () => {
  const { data: session, status } = useSession();

  axiosInstance.interceptors.request.use(
    config => {
      if (status === 'authenticated' && session?.user.access_token) {
        config.headers.Authorization = `Bearer ${session.user.access_token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  const request = useCallback(async (url, options = {}) => {
    const { data } = await axiosInstance({
      url,
      method: options.method || 'GET',
      data: options.data,
      headers: options.headers,
    });

    return data;
  }, []);

  return request;
};
