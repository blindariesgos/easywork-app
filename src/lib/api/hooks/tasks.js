"use client";
import useSWR from "swr";
import fetcher from "../fetcher";

const getQueries = (filters, userId) => {
  const getRepitKeys = (key, arr) =>
    arr.map((item) => `${key}=${item?.id ?? item}`).join("&");
  if (Object.keys(filters).length == 0) return "";

  const getValue = (key, userId) => {
    switch (key) {
      case "role":
        return `${filters[key]}=${userId}`;
      default:
        return `${key}=${filters[key]}`;
    }
  };

  return Object.keys(filters)
    .filter((key) => typeof filters[key] !== "undefined")
    .map((key) =>
      Array.isArray(filters[key])
        ? getRepitKeys(key, filters[key])
        : getValue(key, userId)
    )
    .join("&");
};

export const useTasks = ({
  filters = {},
  userId = "",
  config = {},
  srcConfig = {},
}) => {
  const queries = getQueries(filters, userId);
  const configParams = Object.keys(config)
    .map((key) => `${key}=${config[key]}`)
    .join("&");
  const url = `/tools/tasks/user?${configParams}${queries.length > 0 ? `&${queries}` : ""}`;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    ...srcConfig,
  });

  return {
    tasks: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useTask = (id) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/tools/tasks/${id}`,
    fetcher
  );

  return {
    task: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useTaskComments = (id) => {
  const { data, error, isLoading } = useSWR(
    `/tools/tasks/comments/task/${id}`,
    fetcher
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
    fetcher
  );
  return {
    data,
    isLoading,
    isError: error,
  };
};

export const useTasksList = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `/tools/tasks/helpers/tasks_list`,
    fetcher
  );

  return {
    tasksList: data,
    isLoading,
    isError: error,
    mutate,
  };
};
