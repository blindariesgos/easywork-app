"use client";
import useSWR from "swr";
import fetcher from "../fetcher";

const getQueries = (filters) => {
  const getRepitKeys = (key, arr) =>
    arr.map((item) => `${key}=${item.id}`).join("&");
  if (Object.keys(filters).length == 0) return "";

  const getValue = (key) => {
    switch (key) {
      default:
        return `${key}=${filters[key]}`;
    }
  };

  return Object.keys(filters)
    .map((key) =>
      Array.isArray(filters[key])
        ? getRepitKeys(key, filters[key])
        : getValue(key)
    )
    .join("&");
};

export const useAgents = ({ config = {}, filters = {} }) => {
  const queries = getQueries(filters);
  const configParams = Object.keys(config)
    .map((key) => `${key}=${config[key]}`)
    .join("&");
  const url = `/agent-management/agents?${configParams}${queries.length > 0 ? `&${queries}` : ""}`;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useAgent = (agentId) => {
  const { data, error, isLoading } = useSWR(
    `/agent-management/agents/${agentId}`,
    fetcher
  );

  return {
    data,
    isLoading,
    isError: error,
  };
};
