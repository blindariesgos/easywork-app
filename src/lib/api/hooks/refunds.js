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
        : getValue(key)
    )
    .join("&");
};

export const useRefunds = ({ filters = {}, config = {} }) => {
  const queries = getQueries(filters);
  const configParams = Object.keys(config)
    .map((key) => `${key}=${config[key]}`)
    .join("&");
  const url = `/operations/reimbursements?${configParams}${queries.length > 0 ? `&${queries}` : ""}`;
  // console.log(url);
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  // console.log({ data, isLoading, isError: error });
  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useReimbursement = (reimbursementId) => {
  const url = `/operations/reimbursements/${reimbursementId}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
};
