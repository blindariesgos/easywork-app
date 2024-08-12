"use client";
import useSWR from "swr";
import fetcher from "../fetcher";

export const useLeads = ({ page = 1, limit = 15 }) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/sales/crm/leads?limit=${limit}&page=${page}`,
    fetcher,
  );
  return {
    leads: data,
    isLoading,
    isError: error,
    mutate
  };
};

export const useContact = (id) => {
  const { data, error, isLoading } = useSWR(
    `/sales/crm/leads/${id}`,
    fetcher,
  );

  return {
    lead: data,
    isLoading,
    isError: error,
  };
};

export const useLeadActivities = (id) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/sales/crm/leads/${id}/activities`,
    fetcher,
  );
  return {
    activities: data,
    isLoading,
    isError: error,
    mutate
  };
};
