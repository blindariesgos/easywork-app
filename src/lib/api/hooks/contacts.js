"use client";
import useSWR from "swr";
import fetcher from "../fetcher";

export const useContacts = ({ page = 1, limit = 15 }) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/sales/crm/contacts?limit=${limit}&page=${page}`,
    fetcher,
  );
  return {
    contacts: data,
    isLoading,
    isError: error,
    mutate
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

export const useContactActivities = (id) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/sales/crm/contacts/${id}/activities`,
    fetcher,
  );
  return {
    activities: data,
    isLoading,
    isError: error,
    mutate
  };
};
