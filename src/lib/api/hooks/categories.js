"use client";
import useSWR from "swr";
import fetcher from "../fetcher";
import axios from "../../axios";

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

export const useCategories = ({ config = {}, filters = {} }) => {
  const queries = getQueries(filters);
  const configParams = Object.keys(config)
    .map((key) => `${key}=${config[key]}`)
    .join("&");
  const url = `/sales/crm/polizas/category?${configParams}${queries.length > 0 ? `&${queries}` : ""}`;
  console.log({ url });
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const getCategoryById = async (categoryId) => {
  const response = await axios()
    .get(`/sales/crm/polizas/category/${categoryId}`)
    .catch((error) => ({ hasError: true, ...error }));
  return response;
};

export const createCategory = async (data) => {
  const response = await axios()
    .post(`/sales/crm/polizas/category`, data)
    .catch((error) => ({ hasError: true, ...error }));
  return response;
};
