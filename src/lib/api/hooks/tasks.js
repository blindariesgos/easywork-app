"use client";
import useSWR from "swr";
import fetcher from "../fetcher";

export const useTasks = ({ page = 1, limit = 15 }) => {
  const { data, error, isLoading } = useSWR(
    `/tools/tasks/user?limit=${limit}&page=${page}`,
    fetcher,
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

export const useTaskComments = (id) => {
  const { data, error, isLoading } = useSWR(
    `/tools/tasks/comments/task/${id}`,
    fetcher,
  );

  return {
    comments: data,
    isLoading,
    isError: error,
  };
};

export const useTaskContactsPolizas = () => {
  const { data, error, isLoading } = useSWR(
    `/tools/tasks/helpers/contacts_polizas`,
    fetcher,
  );
  return {
    data,
    isLoading,
    isError: error,
  };
};

export const useTasksList = () => {
  const { data, error, isLoading } = useSWR(
    `/tools/tasks/helpers/tasks_list`,
    fetcher,
  );

  return {
    tasksList: data,
    isLoading,
    isError: error,
  };
};