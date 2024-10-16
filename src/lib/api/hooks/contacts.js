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
    .filter((key) => filters[key] && filters[key].length)
    .map((key) =>
      Array.isArray(filters[key])
        ? getRepitKeys(key, filters[key])
        : getValue(key),
    )
    .join("&");
};

export const useContacts = ({ page = 1, limit = 15, filters = {} }) => {
  const queries = getQueries(filters);

  const url = `/sales/crm/contacts?limit=${limit}&page=${page}${queries.length > 0 ? `&${queries}` : ""}`;
  console.log({ url });
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  return {
    contacts: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useContact = (id) => {
  const { data, error, isLoading } = useSWR(
    `/sales/crm/contacts/${id}`,
    fetcher,
  );

  return {
    contact: data,
    isLoading,
    isError: error,
  };
};

const getActivityPath = (cmrtype) => {
  switch (cmrtype) {
    case "policy":
      return "polizas";
    case "lead":
      return "leads";
    case "receipt":
      return "polizas/receipts";
    default:
      return "contacts";
  }
}
export const useEntityActivities = (id, cmrtype) => {

  const { data, error, isLoading, mutate } = useSWR(
    `/sales/crm/${getActivityPath(cmrtype)}/${id}/activities`,
    fetcher,
  );
  return {
    activities: data,
    isLoading,
    isError: error,
    mutate,
  };
};
