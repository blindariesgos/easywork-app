"use client";
import useSWR from "swr";
import fetcher from "../fetcher";

const getQueries = (filters, userId) => {
  const getRepitKeys = (key, arr) => arr.map(item => `${key}=${item?.id ?? item}`).join('&')
  if (Object.keys(filters).length == 0) return ""

  const getValue = (key, userId) => {
    switch (key) {
      case "role":
        return `${filters[key]}=${userId}`
      default:
        return `${key}=${filters[key]}`
    }
  }

  return Object.keys(filters).map(key =>
    Array.isArray(filters[key])
      ? getRepitKeys(key, filters[key])
      : getValue(key, userId)).join('&')
}

export const useCalendar = ({ filters = {}, page = 1, limit = 15, userId = "" }) => {
  const queries = getQueries(filters, userId)
  const url = `/calendar/events?limit=${limit}&page=${page}${queries.length > 0 ? `&${queries}` : ""}`

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


export const useEvent = (id) => {
  const { data, error, isLoading } = useSWR(
    `/calendar/events/${id}`,
    fetcher,
  );

  return {
    data,
    isLoading,
    isError: error,
  };
};