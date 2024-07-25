"use client";
import useSWR from "swr";
import fetcher from "../fetcher";

export const useTasks = ({ filters = {}, page = 1, limit = 15 }) => {
  const urlFilter = Object.keys(filters).length > 0
    ? Object.keys(filters).map(key => `${key}=${filters[key]}`).join('&')
    : ""
  const url = `/tools/tasks/user?limit=${limit}&page=${page}${urlFilter.length > 0 ? `&${urlFilter}` : ""}`
  console.log({ url })
  const { data, error, isLoading, mutate } = useSWR(
    url,
    fetcher,
  );

  return {
    tasks: data,
    isLoading,
    isError: error,
    mutate
  };
};

export const useTask = (id) => {
  const { data, error, isLoading, mutate } = useSWR(`/tools/tasks/${id}`, fetcher);

  return {
    task: data,
    isLoading,
    isError: error,
    mutate
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
