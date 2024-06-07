"use client";
import useSWR from "swr";
import fetcher from "../fetcher";

export const useTasks = ({ page = 1, limit = 6 }) => {
  const { data, error, isLoading } = useSWR(
    `/tools/tasks/user?limit=${limit}&page=${page}`,
    fetcher
  );

  return {
    tasks: data,
    isLoading,
    isError: error,
  };
};

export const useTask = (id) => {
  const { data, error, isLoading } = useSWR(`/tools/tasks/${id}`, fetcher);

  return {
    task: data,
    isLoading,
    isError: error,
  };
};

export const useTaskContactsPolizas = () => {
  const { data, error, isLoading } = useSWR(
    `/tools/tasks/helpers/contacts_polizas`,
    fetcher
  );
  return {
    data,
    isLoading,
    isError: error,
  };
};
