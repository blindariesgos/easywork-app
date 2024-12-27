"use client";
import useSWR from "swr";
import fetcher from "../fetcher";

const getQueries = (filters) => {
  const getRepitKeys = (key, arr) =>
    arr.map((item) => `${key}=${item?.id ?? item}`).join("&");
  if (Object.keys(filters).length == 0) return "";

  const getValue = (key) => {
    switch (key) {
      default:
        return `${key}=${filters[key]}`;
    }
  };

  return Object.keys(filters)
    .filter((key) => filters[key] && filters[key].length > 0)
    .map((key) =>
      Array.isArray(filters[key])
        ? getRepitKeys(key, filters[key])
        : getValue(key, userId)
    )
    .join("&");
};

export const useSchedules = ({ filters = {}, config = {} }) => {
  const queries = getQueries(filters);
  const configParams = Object.keys(config)
    .map((key) => `${key}=${config[key]}`)
    .join("&");
  const url = `/operations/schedulings/scheduling?${configParams}${queries.length > 0 ? `&${queries}` : ""}`;
  console.log(url);
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const usePortfolioControl = ({
  filters = {},
  config = {},
  groupKey,
}) => {
  const queries = getQueries(filters);
  const configParams = Object.keys(config)
    .map((key) => `${key}=${config[key]}`)
    .join("&");
  const url = `/sales/crm/polizas/receipts/collection_report/${groupKey}?${configParams}${queries.length > 0 ? `&${queries}` : ""}`;
  console.log(url);
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  console.log({ data, error, isLoading });
  if (!groupKey) {
    return {
      data: {
        items: [],
      },
      isLoading: false,
      isError: false,
    };
  }

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const usePoliciesByContactId = ({ contactId, config = {} }) => {
  const configParams = Object.keys(config)
    .map((key) => `${key}=${config[key]}`)
    .join("&");
  const url = `/sales/crm/polizas/contact/${contactId}?${configParams}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const usePolicy = (policyId) => {
  const url = `/sales/crm/polizas/${policyId}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
};
