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

export const useLeads = ({ config = {}, filters = {} }) => {
  const queries = getQueries(filters);
  const configParams = Object.keys(config)
    .map((key) => `${key}=${config[key]}`)
    .join("&");
  const url = `/sales/crm/leads?${configParams}${queries.length > 0 ? `&${queries}` : ""}`;
  console.log({ url });
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  return {
    leads: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useLead = (id) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/sales/crm/leads/${id}`,
    fetcher
  );

  return {
    lead: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useLeadCancelReazon = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `/sales/crm/leads/cancel-reazon`,
    fetcher
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useLeadActivities = (id) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/sales/crm/leads/${id}/activities`,
    fetcher,
    { refreshInterval: 1000 }
  );
  return {
    activities: data,
    isLoading,
    isError: error,
    mutate,
  };
};
