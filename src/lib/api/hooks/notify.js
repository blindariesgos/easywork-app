"use client";
import useSWR from "swr";
import fetcher from "../fetcher";

export const useNotify = () => {
  const { data, error, isLoading } = useSWR(`/notify/`, fetcher);

  return {
    notifications: data,
    isLoading,
    isError: error,
  };
};
