"use client";
import useSWR from "swr";
import fetcher from "../fetcher";

const getQueries = (filters) => {
  const getRepitKeys = (key, arr) => arr.map(item => `${key}=${item.id}`).join('&')
  if (Object.keys(filters).length == 0) return ""

  const getValue = (key) => {
    switch (key) {
      default:
        return `${key}=${filters[key]}`
    }
  }

  return Object.keys(filters).map(key =>
    Array.isArray(filters[key])
      ? getRepitKeys(key, filters[key])
      : getValue(key)).join('&')
}

export const useUsers = ({ config = {}, filters = {} }) => {
  const queries = getQueries(filters)
  const configParams = Object.keys(config).map(key => `${key}=${config[key]}`).join('&')
  const url = `/users?${configParams}${queries.length > 0 ? `&${queries}` : ""}`
  console.log({ url })
  const { data, error, isLoading, mutate } = useSWR(
    url,
    fetcher,
  );
  return {
    data,
    isLoading,
    isError: error,
    mutate
  };
};

export const useUser = (id) => {
  const { data, error, isLoading } = useSWR(
    `/users/${id}`,
    fetcher,
  );

  return {
    data,
    isLoading,
    isError: error,
  };
};
