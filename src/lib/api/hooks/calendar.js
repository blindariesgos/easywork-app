"use client";
import useSWR from "swr";
import fetcher from "../fetcher";
import { useSession } from "next-auth/react";

const getQueries = (filters, userId) => {
  const getRepitKeys = (key, arr) =>
    arr.map((item) => `${key}=${item?.id ?? item}`).join("&");

  if (Object.keys(filters).length === 0 && !userId) return "";

  const getValue = (key, userId) => {
    switch (key) {
      case "role":
        return `${filters[key]}=${userId}`;
      default:
        return `${key}=${filters[key]}`;
    }
  };

  const filterQueries = Object.keys(filters)
    .map((key) =>
      Array.isArray(filters[key])
        ? getRepitKeys(key, filters[key])
        : getValue(key, userId)
    )
    .join("&");

  const userIdQuery = userId ? `userId=${userId}` : "";

  return [filterQueries, userIdQuery].filter(Boolean).join("&"); 
};

export const useCalendar = ({ filters = {}, page = 1, limit = 15 }) => {
  const { data: session } = useSession(); 
  const userId = session?.user?.sub; 

  const queries = getQueries(filters, userId); 
  const url = `/calendar/events?limit=${limit}&page=${page}${
    queries.length > 0 ? `&${queries}` : ""
  }`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  console.log(data);

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useEvent = (id) => {
  const { data: session } = useSession();
  const userId = session?.user?.sub;

  const url = `/calendar/events/${id}?${userId ? `userId=${userId}` : ""}`;
  const { data, error, isLoading } = useSWR(url, fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
};
